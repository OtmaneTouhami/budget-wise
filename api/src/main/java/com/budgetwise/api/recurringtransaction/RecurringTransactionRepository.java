package com.budgetwise.api.recurringtransaction;

import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, UUID> {
    // Finds all rules for a user, ordered by what's coming next
    List<RecurringTransaction> findByUserOrderByNextExecutionDateAsc(User user);
}