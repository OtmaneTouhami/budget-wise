package com.budgetwise.api.category.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class CategoryResponse {
    private UUID id;
    private String name;
    private String description;
    private String categoryType;
    private String color;
}
