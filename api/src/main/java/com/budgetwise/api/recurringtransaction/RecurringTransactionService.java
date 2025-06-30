package com.budgetwise.api.recurringtransaction;

import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionRequest;
import com.budgetwise.api.recurringtransaction.dto.RecurringTransactionResponse;
import com.budgetwise.api.recurringtransaction.dto.UpdateRecurringStatusRequest;
import java.util.List;
import java.util.UUID;

public interface RecurringTransactionService {
    RecurringTransactionResponse createRecurringTransaction(RecurringTransactionRequest request);
    List<RecurringTransactionResponse> getAllUserRecurringTransactions();
    RecurringTransactionResponse getRecurringTransactionById(UUID id);
    RecurringTransactionResponse updateRecurringTransaction(UUID id, RecurringTransactionRequest request);
    RecurringTransactionResponse updateStatus(UUID id, UpdateRecurringStatusRequest request);
    void deleteRecurringTransaction(UUID id);
}