package com.budgetwise.api.recurringtransaction;

import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionRequest;
import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionResponse;
import com.budgetwise.api.recurringtransaction.dto.UpdateRecurringStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/recurring-transactions")
@RequiredArgsConstructor
public class RecurringTransactionController {

    private final RecurringTransactionService recurringService;

    @PostMapping
    public ResponseEntity<RecurringTransactionResponse> createRecurringTransaction(@Valid @RequestBody RecurringTransactionRequest request) {
        return new ResponseEntity<>(recurringService.createRecurringTransaction(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecurringTransactionResponse>> getAllUserRecurringTransactions() {
        return ResponseEntity.ok(recurringService.getAllUserRecurringTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecurringTransactionResponse> getRecurringTransactionById(@PathVariable UUID id) {
        return ResponseEntity.ok(recurringService.getRecurringTransactionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransactionResponse> updateRecurringTransaction(@PathVariable UUID id, @Valid @RequestBody RecurringTransactionRequest request) {
        return ResponseEntity.ok(recurringService.updateRecurringTransaction(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RecurringTransactionResponse> updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateRecurringStatusRequest request) {
        return ResponseEntity.ok(recurringService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringTransaction(@PathVariable UUID id) {
        recurringService.deleteRecurringTransaction(id);
        return ResponseEntity.noContent().build();
    }
}