package com.budgetwise.api.transactiontemplate.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class TransactionTemplateResponse {
    private UUID id;
    private String name;
    private BigDecimal amount;
    private String description;
    private UUID categoryId;
    private String categoryName;
}