package com.budgetwise.api.transaction;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.enums.CategoryType;
import com.budgetwise.api.dashboard.dto.CategorySpending;
import com.budgetwise.api.dashboard.dto.DailySpending;
import com.budgetwise.api.dashboard.dto.TopTransaction;
import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    // Efficiently checks if any transaction is linked to this category
    boolean existsByCategory(Category category);

    List<Transaction> findByUserAndCategoryAndTransactionDateBetween(
            User user, Category category, LocalDateTime start, LocalDateTime end
    );

    // Finds all transactions for a user, ordered by the most recent first
    @Query("SELECT t FROM Transaction t WHERE t.user = :user " +
            "ORDER BY t.transactionDate DESC")
    List<Transaction> findAllByUser(@Param("user") User user);

    // Finds all transactions for a user within a given date range, ordered by the most recent first
    @Query("SELECT t FROM Transaction t WHERE t.user = :user " +
            "AND t.transactionDate >= :startDate " +
            "AND t.transactionDate < :endDate " +
            "ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // --- METHODS FOR DASHBOARD ---

    /**
     * Calculates the total sum of transactions for a user within a date range,
     * filtered by the category type (INCOME or EXPENSE).
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user " +
            "AND t.category.categoryType = :type " +
            "AND t.transactionDate >= :startDate AND t.transactionDate < :endDate")
    BigDecimal sumAmountByCategoryType(
            @Param("user") User user,
            @Param("type") CategoryType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Groups all expenses by category and calculates the total amount for each,
     * providing data for a spending breakdown pie chart.
     */
    @Query("SELECT new com.budgetwise.api.dashboard.dto.CategorySpending(t.category.name, SUM(t.amount)) " +
            "FROM Transaction t WHERE t.user = :user " +
            "AND t.category.categoryType = com.budgetwise.api.category.enums.CategoryType.EXPENSE " +
            "AND t.transactionDate >= :startDate AND t.transactionDate < :endDate " +
            "GROUP BY t.category.name ORDER BY SUM(t.amount) DESC")
    List<CategorySpending> findExpenseBreakdownByCategory(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Groups all expenses by day and calculates the total amount for each day,
     * providing data for a spending trend line chart.
     * NOTE: The function used to truncate the date may be database-specific.
     * DATE() is standard for MariaDB/MySQL. For PostgreSQL, it's DATE_TRUNC('day', ...).
     */
    @Query("SELECT new com.budgetwise.api.dashboard.dto.DailySpending(DATE(t.transactionDate), CAST(SUM(t.amount) AS double)) " +
            "FROM Transaction t WHERE t.user = :user " +
            "AND t.category.categoryType = com.budgetwise.api.category.enums.CategoryType.EXPENSE " +
            "AND t.transactionDate >= :startDate AND t.transactionDate < :endDate " +
            "GROUP BY DATE(t.transactionDate) ORDER BY DATE(t.transactionDate) ASC")
    List<DailySpending> findSpendingTrendByDay(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Finds the single largest expense transaction for a user within a given date range.
     */
    @Query("SELECT new com.budgetwise.api.dashboard.dto.TopTransaction(t.id, t.description, t.amount, t.transactionDate) " +
            "FROM Transaction t WHERE t.user = :user " +
            "AND t.category.categoryType = com.budgetwise.api.category.enums.CategoryType.EXPENSE " +
            "AND t.transactionDate >= :startDate AND t.transactionDate < :endDate " +
            "ORDER BY t.amount DESC LIMIT 1")
    TopTransaction findTopExpenseTransaction(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}