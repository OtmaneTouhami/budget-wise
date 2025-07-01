package com.budgetwise.api.transaction.impl;

import com.budgetwise.api.budget.BudgetAlertService;
import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.CategoryRepository;
import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.transaction.Transaction;
import com.budgetwise.api.transaction.TransactionRepository;
import com.budgetwise.api.transaction.TransactionService;
import com.budgetwise.api.transaction.dto.CreateTransactionFromTemplateRequest;
import com.budgetwise.api.transaction.dto.TransactionRequest;
import com.budgetwise.api.transaction.dto.TransactionResponse;
import com.budgetwise.api.transaction.mapper.TransactionMapper;
import com.budgetwise.api.transactiontemplate.TransactionTemplate;
import com.budgetwise.api.transactiontemplate.TransactionTemplateRepository;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;
    private final TransactionTemplateRepository templateRepository;
    private final BudgetAlertService budgetAlertService;


    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User currentUser = getCurrentUser();
        Category category = findCategoryAndVerifyOwnership(request.getCategoryId(), currentUser);

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .category(category)
                .user(currentUser)
                .isCreatedAutomatically(false)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        // After saving, check if this transaction triggers a budget alert.
        budgetAlertService.checkBudgetAfterTransaction(saved);

        return transactionMapper.toDto(saved);
    }

    @Override
    @Transactional
    public TransactionResponse createTransactionFromTemplate(
            UUID templateId,
            CreateTransactionFromTemplateRequest request
    ) {
        User currentUser = getCurrentUser();
        TransactionTemplate template = findTemplateAndVerifyOwnership(templateId, currentUser);

        BigDecimal transactionAmount = getTransactionAmount(request, template);

        Transaction transaction = Transaction.builder()
                .amount(transactionAmount)
                .description(template.getDescription())
                .transactionDate(LocalDateTime.now())
                .category(template.getCategory())
                .user(currentUser)
                .isCreatedAutomatically(false)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        return transactionMapper.toDto(saved);
    }

    @Override
    public List<TransactionResponse> getTransactions(LocalDate startDate, LocalDate endDate) {
        User currentUser = getCurrentUser();
        LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = (endDate != null) ? endDate.plusDays(1).atStartOfDay() : null;

        List<Transaction> transactions;
        if (startDateTime != null && endDateTime != null) {
            transactions = transactionRepository.findByUserAndDateRange(currentUser, startDateTime, endDateTime);
        } else {
            transactions = transactionRepository.findAllByUser(currentUser);
        }

        return transactionMapper.toDtoList(transactions);
    }

    @Override
    public TransactionResponse getTransactionById(UUID id) {
        return transactionMapper.toDto(findTransactionAndVerifyOwnership(id));
    }

    @Override
    @Transactional
    public TransactionResponse updateTransaction(UUID id, TransactionRequest request) {
        Transaction transaction = findTransactionAndVerifyOwnership(id);
        Category category = findCategoryAndVerifyOwnership(request.getCategoryId(), getCurrentUser());

        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setCategory(category);

        Transaction updated = transactionRepository.save(transaction);
        return transactionMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteTransaction(UUID id) {
        Transaction transaction = findTransactionAndVerifyOwnership(id);
        transactionRepository.delete(transaction);
    }

    @Override
    public void exportTransactionsToCsv(HttpServletResponse response, LocalDate startDate, LocalDate endDate) throws IOException {
        // Get the data
        List<TransactionResponse> transactions = getTransactions(startDate, endDate);

        // Set HTTP headers for CSV download
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"transactions.csv\"");

        try (PrintWriter writer = response.getWriter();
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                     .withHeader("ID", "Date", "Description", "Amount", "Category", "Type"))) {

            for (TransactionResponse tx : transactions) {
                csvPrinter.printRecord(
                        tx.getId(),
                        tx.getTransactionDate(),
                        tx.getDescription(),
                        tx.getAmount(),
                        tx.getCategoryName(),
                        tx.getCategoryType().name()
                );
            }
        }
    }


    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private Transaction findTransactionAndVerifyOwnership(UUID transactionId) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this transaction");
        }
        return transaction;
    }

    private Category findCategoryAndVerifyOwnership(UUID categoryId, User user) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        if (!category.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to use this category");
        }
        return category;
    }

    private TransactionTemplate findTemplateAndVerifyOwnership(UUID templateId, User user) {
        TransactionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));
        if (!template.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to use this template");
        }
        return template;
    }

    private static BigDecimal getTransactionAmount(
            CreateTransactionFromTemplateRequest request,
            TransactionTemplate template
    ) {
        BigDecimal transactionAmount;

        if (template.getAmount() != null) {
            transactionAmount = template.getAmount();
        } else if (request.getAmount() != null) {
            transactionAmount = request.getAmount();
        } else {
            throw new IllegalArgumentException(
                    "Amount is required as this template does not have a pre-defined amount."
            );
        }
        return transactionAmount;
    }
}