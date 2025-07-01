package com.budgetwise.api.transaction.dto;

import com.budgetwise.api.category.enums.CategoryType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionResponse {
    private UUID id;
    private BigDecimal amount;
    private String description;
    private LocalDateTime transactionDate;
    private UUID categoryId;
    private String categoryName;
    private CategoryType categoryType;
}