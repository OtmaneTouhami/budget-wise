package com.budgetwise.api.dashboard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Data
public class DailySpending {
    private LocalDate date;
    private BigDecimal totalAmount;

    // Custom constructor for the JPQL query
    public DailySpending(Date date, Double totalAmount) {
        this.date = new java.sql.Date(date.getTime()).toLocalDate();
        this.totalAmount = (totalAmount == null) ? BigDecimal.ZERO : BigDecimal.valueOf(totalAmount);
    }
}