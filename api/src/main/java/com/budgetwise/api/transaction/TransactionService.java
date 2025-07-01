package com.budgetwise.api.transaction;

import com.budgetwise.api.transaction.dto.CreateTransactionFromTemplateRequest;
import com.budgetwise.api.transaction.dto.TransactionRequest;
import com.budgetwise.api.transaction.dto.TransactionResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);
    TransactionResponse createTransactionFromTemplate(UUID templateId, CreateTransactionFromTemplateRequest request);
    List<TransactionResponse> getTransactions(LocalDate startDate, LocalDate endDate);
    TransactionResponse getTransactionById(UUID id);
    TransactionResponse updateTransaction(UUID id, TransactionRequest request);
    void deleteTransaction(UUID id);
    void exportTransactionsToCsv(HttpServletResponse response, LocalDate startDate, LocalDate endDate) throws IOException;
}