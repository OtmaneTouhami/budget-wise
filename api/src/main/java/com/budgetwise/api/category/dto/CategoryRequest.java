package com.budgetwise.api.category.dto;

import com.budgetwise.api.validation.ValidCategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    @NotNull(message = "Category type is required")
    @ValidCategoryType
    private String categoryType;

    @Pattern(regexp = "^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", message = "Color must be a valid hex code (e.g., #RRGGBB)")
    private String color;
}
