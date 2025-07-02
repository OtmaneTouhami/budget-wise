package com.budgetwise.api.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailySpending {
    private LocalDate date;
    private BigDecimal totalAmount;
}
