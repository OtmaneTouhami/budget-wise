package com.budgetwise.api.transactiontemplate;

import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransactionTemplateRepository extends JpaRepository<TransactionTemplate, UUID> {
  // Finds all templates for a specific user, ordered by name
  List<TransactionTemplate> findByUserOrderByNameAsc(User user);
}