package com.budgetwise.api.category.impl;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.CategoryRepository;
import com.budgetwise.api.category.CategoryService;
import com.budgetwise.api.category.dto.CategoryRequest;
import com.budgetwise.api.category.dto.CategoryResponse;
import com.budgetwise.api.category.enums.CategoryType;
import com.budgetwise.api.category.mapper.CategoryMapper;
import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.security.SecurityUtils;
import com.budgetwise.api.transaction.TransactionRepository;
import com.budgetwise.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImp implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final TransactionRepository transactionRepository;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .categoryType(CategoryType.valueOf(request.getCategoryType().toUpperCase()))
                .color(request.getColor())
                .user(currentUser)
                .build();
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    @Override
    public List<CategoryResponse> getAllUserCategories() {
        User currentUser = securityUtils.getCurrentUser();
        List<Category> categories = categoryRepository.findByUserOrderByCreatedAtDesc(currentUser);
        return categoryMapper.toDtoList(categories);
    }

    @Override
    public CategoryResponse getCategoryById(UUID id) {
        Category category = findCategoryAndVerifyOwnership(id);
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = findCategoryAndVerifyOwnership(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setCategoryType(CategoryType.valueOf(request.getCategoryType().toUpperCase()));
        category.setColor(request.getColor());
        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = findCategoryAndVerifyOwnership(id);
        // Business Rule: Prevent deletion if a category is linked to transactions
        if (transactionRepository.existsByCategory(category)) {
            throw new IllegalStateException("Cannot delete category with existing transactions.");
        }
        categoryRepository.delete(category);
    }


    private Category findCategoryAndVerifyOwnership(UUID categoryId) {
        User currentUser = securityUtils.getCurrentUser();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        if (!category.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this category");
        }
        return category;
    }
}
