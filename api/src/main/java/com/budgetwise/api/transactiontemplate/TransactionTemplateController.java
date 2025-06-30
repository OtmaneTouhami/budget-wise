package com.budgetwise.api.transactiontemplate;

import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateRequest;
import com.budgetwise.api.transactiontemplate.dto.TransactionTemplateResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transaction-templates")
@RequiredArgsConstructor
public class TransactionTemplateController {

    private final TransactionTemplateService templateService;

    @PostMapping
    public ResponseEntity<TransactionTemplateResponse> createTemplate(@Valid @RequestBody TransactionTemplateRequest request) {
        return new ResponseEntity<>(templateService.createTemplate(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TransactionTemplateResponse>> getAllUserTemplates() {
        return ResponseEntity.ok(templateService.getAllUserTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionTemplateResponse> getTemplateById(@PathVariable UUID id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionTemplateResponse> updateTemplate(@PathVariable UUID id, @Valid @RequestBody TransactionTemplateRequest request) {
        return ResponseEntity.ok(templateService.updateTemplate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}