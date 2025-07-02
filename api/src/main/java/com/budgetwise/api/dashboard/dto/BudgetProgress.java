package com.budgetwise.api.dashboard.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class BudgetProgress {
    private UUID budgetId;
    private UUID categoryId;
    private String categoryName;
    private BigDecimal amountSpent;
    private BigDecimal budgetAmount;
    private BigDecimal amountRemaining;

    // Constructor that will be used by the JPQL query
    public BudgetProgress(
            UUID budgetId,
            UUID categoryId,
            String categoryName,
            BigDecimal amountSpent,
            BigDecimal budgetAmount
    ) {
        this.budgetId = budgetId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.amountSpent = amountSpent;
        this.budgetAmount = budgetAmount;
    }
}
