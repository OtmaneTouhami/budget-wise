package com.budgetwise.api.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CategorySpending {
    private String categoryName;
    private BigDecimal totalAmount;
}
