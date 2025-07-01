package com.budgetwise.api.transaction;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  // Efficiently checks if any transaction is linked to this category
  boolean existsByCategory(Category category);

  // Finds all transactions for a user, ordered by most recent first
  List<Transaction> findByUserOrderByTransactionDateDesc(User user);

  // Finds all transactions for a user within a given date range, ordered by most recent first
  List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(User user, LocalDateTime startDate, LocalDateTime endDate);

  @Query("SELECT t FROM Transaction t WHERE t.user = :user ORDER BY t.transactionDate DESC")
  List<Transaction> findAllByUser(@Param("user") User user);

  @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.transactionDate >= :startDate AND t.transactionDate < :endDate ORDER BY t.transactionDate DESC")
  List<Transaction> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}