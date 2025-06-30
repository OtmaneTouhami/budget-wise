package com.budgetwise.api.transaction;

import com.budgetwise.api.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  // Efficiently checks if any transaction is linked to this category
  boolean existsByCategory(Category category);
}