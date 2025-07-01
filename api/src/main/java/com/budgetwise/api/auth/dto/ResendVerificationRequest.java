package com.budgetwise.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendVerificationRequest {

    @NotBlank(message = "Username or email is required")
    private String identifier;
}