package com.budgetwise.api.budget;

import com.budgetwise.api.transaction.Transaction;

public interface BudgetAlertService {
    void checkBudgetAfterTransaction(Transaction transaction);
}
