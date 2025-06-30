package com.budgetwise.api.recurringtransaction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, UUID> {
  }