package com.budgetwise.api.recurringtransaction.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRecurringStatusRequest {
    @NotNull(message = "Active status is required")
    private Boolean isActive;
}
