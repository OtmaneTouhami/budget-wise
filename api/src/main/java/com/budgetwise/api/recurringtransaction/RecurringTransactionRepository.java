package com.budgetwise.api.recurringtransaction;

import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, UUID> {
    // Finds all rules for a user, ordered by what's coming next
    List<RecurringTransaction> findByUserOrderByNextExecutionDateAsc(User user);

    @Query("SELECT rt FROM RecurringTransaction rt WHERE rt.isActive = true AND rt.nextExecutionDate <= :date")
    List<RecurringTransaction> findDueRecurringTransactions(@Param("date") LocalDate date);
}