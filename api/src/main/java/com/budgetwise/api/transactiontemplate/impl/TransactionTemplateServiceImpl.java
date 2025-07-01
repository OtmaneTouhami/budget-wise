package com.budgetwise.api.transactiontemplate.impl;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.CategoryRepository;
import com.budgetwise.api.exception.ResourceNotFoundException;
import com.budgetwise.api.security.SecurityUtils;
import com.budgetwise.api.transactiontemplate.TransactionTemplate;
import com.budgetwise.api.transactiontemplate.TransactionTemplateRepository;
import com.budgetwise.api.transactiontemplate.TransactionTemplateService;
import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateRequest;
import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateResponse;
import com.budgetwise.api.transactiontemplate.mapper.TransactionTemplateMapper;
import com.budgetwise.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionTemplateServiceImpl implements TransactionTemplateService {

    private final TransactionTemplateRepository templateRepository;
    private final CategoryRepository categoryRepository;
    private final SecurityUtils securityUtils;
    private final TransactionTemplateMapper templateMapper;

    @Override
    @Transactional
    public TransactionTemplateResponse createTemplate(TransactionTemplateRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to use this category");
        }

        TransactionTemplate template = TransactionTemplate.builder()
                .name(request.getName())
                .amount(request.getAmount())
                .description(request.getDescription())
                .category(category)
                .user(currentUser)
                .build();

        // The unique constraint on the table (user_id, name) will prevent duplicates
        TransactionTemplate savedTemplate = templateRepository.save(template);
        return templateMapper.toDto(savedTemplate);
    }

    @Override
    public List<TransactionTemplateResponse> getAllUserTemplates() {
        User currentUser = securityUtils.getCurrentUser();
        List<TransactionTemplate> templates = templateRepository.findByUserOrderByNameAsc(currentUser);
        return templateMapper.toDtoList(templates);
    }

    @Override
    public TransactionTemplateResponse getTemplateById(UUID id) {
        return templateMapper.toDto(findTemplateAndVerifyOwnership(id));
    }

    @Override
    @Transactional
    public TransactionTemplateResponse updateTemplate(UUID id, TransactionTemplateRequest request) {
        TransactionTemplate template = findTemplateAndVerifyOwnership(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new AccessDeniedException("You do not have permission to use this category");
        }

        template.setName(request.getName());
        template.setAmount(request.getAmount());
        template.setDescription(request.getDescription());
        template.setCategory(category);

        TransactionTemplate updatedTemplate = templateRepository.save(template);
        return templateMapper.toDto(updatedTemplate);
    }

    @Override
    @Transactional
    public void deleteTemplate(UUID id) {
        TransactionTemplate template = findTemplateAndVerifyOwnership(id);
        templateRepository.delete(template);
    }

    private TransactionTemplate findTemplateAndVerifyOwnership(UUID templateId) {
        User currentUser = securityUtils.getCurrentUser();
        TransactionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));
        if (!template.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this template");
        }
        return template;
    }
}
