package com.budgetwise.api.budget.dto;

import com.budgetwise.api.budget.Budget;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for {@link Budget}
 */
@Data
@Builder
public class BudgetResponse {
    private UUID id;
    private LocalDate budgetMonth;
    private BigDecimal budgetAmount;
    private boolean autoRenew;
    private UUID categoryId;
    private String categoryName;
}