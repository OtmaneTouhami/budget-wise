package com.budgetwise.api.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateTransactionFromTemplateRequest {
    // This amount is optional. If the template has an amount, this can be null.
    // If the template does NOT have an amount, this field is required.
    @DecimalMin(value = "0.01", message = "Amount must be positive if provided")
    private BigDecimal amount;
}
