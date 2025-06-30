package com.budgetwise.api.transactiontemplate;

import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateRequest;
import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateResponse;

import java.util.List;
import java.util.UUID;

public interface TransactionTemplateService {
    TransactionTemplateResponse createTemplate(TransactionTemplateRequest request);
    List<TransactionTemplateResponse> getAllUserTemplates();
    TransactionTemplateResponse getTemplateById(UUID id);
    TransactionTemplateResponse updateTemplate(UUID id, TransactionTemplateRequest request);
    void deleteTemplate(UUID id);
}
