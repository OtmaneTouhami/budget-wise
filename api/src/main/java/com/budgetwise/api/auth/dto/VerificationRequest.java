package com.budgetwise.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerificationRequest {

    @NotBlank(message = "Username or email is required")
    private String identifier;

    @NotBlank(message = "Token is required")
    private String token;
}