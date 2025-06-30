package com.budgetwise.api.recurringtransaction.dto;

import com.budgetwise.api.validation.ValidScheduleType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class RecurringTransactionRequest {
    @NotBlank(message = "Rule name is required")
    private String name;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    private BigDecimal amount;

    private String description;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Schedule type is required")
    @ValidScheduleType
    private String scheduleType;

    @NotNull(message = "Category is required")
    private UUID categoryId;
}