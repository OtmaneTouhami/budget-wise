package com.budgetwise.api.recurringtransaction.impl;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.CategoryRepository;
import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.recurringtransaction.RecurringTransaction;
import com.budgetwise.api.recurringtransaction.RecurringTransactionRepository;
import com.budgetwise.api.recurringtransaction.RecurringTransactionService;
import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionRequest;
import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionResponse;
import com.budgetwise.api.recurringtransaction.dto.UpdateRecurringStatusRequest;
import com.budgetwise.api.recurringtransaction.enums.ScheduleType;
import com.budgetwise.api.recurringtransaction.mapper.RecurringTransactionMapper;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecurringTransactionServiceImpl implements RecurringTransactionService {

    private final RecurringTransactionRepository recurringRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RecurringTransactionMapper recurringMapper;

    @Override
    @Transactional
    public RecurringTransactionResponse createRecurringTransaction(RecurringTransactionRequest request) {
        User currentUser = getCurrentUser();
        Category category = findCategoryAndVerifyOwnership(request.getCategoryId(), currentUser);

        RecurringTransaction recurring = RecurringTransaction.builder()
                .name(request.getName())
                .amount(request.getAmount())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .nextExecutionDate(request.getStartDate()) // CRITICAL: First execution is on the start date
                .isActive(true)
                .scheduleType(ScheduleType.valueOf(request.getScheduleType().toUpperCase()))
                .category(category)
                .user(currentUser)
                .build();

        RecurringTransaction saved = recurringRepository.save(recurring);
        return recurringMapper.toDto(saved);
    }

    @Override
    public List<RecurringTransactionResponse> getAllUserRecurringTransactions() {
        User currentUser = getCurrentUser();
        return recurringMapper.toDtoList(recurringRepository.findByUserOrderByNextExecutionDateAsc(currentUser));
    }

    @Override
    public RecurringTransactionResponse getRecurringTransactionById(UUID id) {
        return recurringMapper.toDto(findRuleAndVerifyOwnership(id));
    }

    @Override
    @Transactional
    public RecurringTransactionResponse updateRecurringTransaction(UUID id, RecurringTransactionRequest request) {
        RecurringTransaction recurring = findRuleAndVerifyOwnership(id);
        Category category = findCategoryAndVerifyOwnership(request.getCategoryId(), getCurrentUser());

        recurring.setName(request.getName());
        recurring.setAmount(request.getAmount());
        recurring.setDescription(request.getDescription());
        recurring.setStartDate(request.getStartDate());
        recurring.setEndDate(request.getEndDate());
        recurring.setScheduleType(ScheduleType.valueOf(request.getScheduleType().toUpperCase()));
        recurring.setCategory(category);

        RecurringTransaction updated = recurringRepository.save(recurring);
        return recurringMapper.toDto(updated);
    }

    @Override
    @Transactional
    public RecurringTransactionResponse updateStatus(UUID id, UpdateRecurringStatusRequest request) {
        RecurringTransaction recurring = findRuleAndVerifyOwnership(id);
        recurring.setActive(request.getIsActive());
        RecurringTransaction updated = recurringRepository.save(recurring);
        return recurringMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteRecurringTransaction(UUID id) {
        // Business Rule: We only allow deleting if it's inactive to prevent accidental deletion
        RecurringTransaction recurring = findRuleAndVerifyOwnership(id);
        if (recurring.isActive()) {
            throw new IllegalStateException("Cannot delete an active recurring transaction. Please deactivate it first.");
        }
        recurringRepository.delete(recurring);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private RecurringTransaction findRuleAndVerifyOwnership(UUID ruleId) {
        User currentUser = getCurrentUser();
        RecurringTransaction recurring = recurringRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + ruleId));
        if (!recurring.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this resource");
        }
        return recurring;
    }

    private Category findCategoryAndVerifyOwnership(UUID categoryId, User user) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        if (!category.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to use this category");
        }
        return category;
    }
}