package com.budgetwise.api.recurringtransaction.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class RecurringTransactionResponse {
    private UUID id;
    private String name;
    private BigDecimal amount;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate nextExecutionDate;
    private boolean isActive;
    private String scheduleType;
    private UUID categoryId;
    private String categoryName;
}