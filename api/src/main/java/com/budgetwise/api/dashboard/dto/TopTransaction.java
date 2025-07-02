package com.budgetwise.api.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TopTransaction {
    private UUID transactionId;
    private String description;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
}
