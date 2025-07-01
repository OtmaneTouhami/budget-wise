package com.budgetwise.api.budget.impl;

import com.budgetwise.api.budget.Budget;
import com.budgetwise.api.budget.BudgetRepository;
import com.budgetwise.api.budget.BudgetService;
import com.budgetwise.api.budget.dto.BudgetRequest;
import com.budgetwise.api.budget.dto.BudgetResponse;
import com.budgetwise.api.budget.mapper.BudgetMapper;
import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.CategoryRepository;
import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.security.SecurityUtils;
import com.budgetwise.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final SecurityUtils securityUtils;
    private final BudgetMapper budgetMapper;

    @Override
    @Transactional
    public BudgetResponse createBudget(BudgetRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // Security Check: Ensure the user owns the category
        if (!category.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to create a budget for this category");
        }

        Budget budget = Budget.builder()
                .budgetMonth(YearMonth.parse(request.getBudgetMonth()).atDay(1))
                .budgetAmount(request.getBudgetAmount())
                .autoRenew(request.getAutoRenew())
                .user(currentUser)
                .category(category)
                .build();

        // The unique constraint on the table will prevent duplicates,
        // and the GlobalExceptionHandler will catch the DataIntegrityViolationException.
        Budget savedBudget = budgetRepository.save(budget);

        return budgetMapper.toDto(savedBudget);
    }

    @Override
    public List<BudgetResponse> getBudgets(int year, int month) {
        User currentUser = securityUtils.getCurrentUser();
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Budget> budgets = budgetRepository.findByUserAndBudgetMonthBetween(currentUser, startDate, endDate);
        return budgetMapper.toDtoList(budgets);
    }

    @Override
    public BudgetResponse getBudgetById(UUID id) {
        return budgetMapper.toDto(findBudgetAndVerifyOwnership(id));
    }

    @Override
    @Transactional
    public BudgetResponse updateBudget(UUID id, BudgetRequest request) {
        Budget budget = findBudgetAndVerifyOwnership(id);

        // We only allow updating the amount and auto-renew status.
        // Changing a category or month would be a new budget.
        budget.setBudgetAmount(request.getBudgetAmount());
        budget.setAutoRenew(request.getAutoRenew());

        Budget updatedBudget = budgetRepository.save(budget);
        return budgetMapper.toDto(updatedBudget);
    }

    @Override
    @Transactional
    public void deleteBudget(UUID id) {
        Budget budget = findBudgetAndVerifyOwnership(id);
        budgetRepository.delete(budget);
    }

    private Budget findBudgetAndVerifyOwnership(UUID budgetId) {
        User currentUser = securityUtils.getCurrentUser();
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));
        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this budget");
        }
        return budget;
    }
}
