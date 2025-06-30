package com.budgetwise.api.budget;

import com.budgetwise.api.budget.dto.BudgetRequest;
import com.budgetwise.api.budget.dto.BudgetResponse;

import java.util.List;
import java.util.UUID;

public interface BudgetService {
    BudgetResponse createBudget(BudgetRequest request);
    List<BudgetResponse> getBudgets(int year, int month);
    BudgetResponse getBudgetById(UUID id);
    BudgetResponse updateBudget(UUID id, BudgetRequest request);
    void deleteBudget(UUID id);
}
