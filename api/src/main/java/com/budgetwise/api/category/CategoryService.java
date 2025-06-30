package com.budgetwise.api.category;

import com.budgetwise.api.category.dto.CategoryRequest;
import com.budgetwise.api.category.dto.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllUserCategories();
    CategoryResponse getCategoryById(UUID id);
    CategoryResponse updateCategory(UUID id, CategoryRequest request);
    void deleteCategory(UUID id);
}
