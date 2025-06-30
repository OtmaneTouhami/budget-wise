package com.budgetwise.api.transactiontemplate.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class TransactionTemplateRequest {
    @NotBlank(message = "Template name is required")
    private String name;

    // Amount is optional
    @DecimalMin(value = "0.01", message = "Amount must be positive if provided")
    private BigDecimal amount;

    private String description;

    @NotNull(message = "Category is required")
    private UUID categoryId;
}