package com.budgetwise.api.budget;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.dashboard.dto.BudgetProgress;
import com.budgetwise.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    // Finds budgets for a user within a given start and end date (inclusive)
    List<Budget> findByUserAndBudgetMonthBetween(
            User user, LocalDate startDate, LocalDate endDate
    );

    Optional<Budget> findByUserAndCategoryAndBudgetMonth(
            User user, Category category, LocalDate budgetMonth
    );

    @Query("SELECT b FROM Budget b WHERE b.autoRenew = true " +
            "AND b.budgetMonth BETWEEN :startDate AND :endDate")
    List<Budget> findBudgetsToRenew(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // --- METHOD FOR DASHBOARD ---

    /**
     * Finds all budgets for a user in a given month and calculates the total spent for each.
     * This query fetches the raw data needed to build the BudgetProgress DTO.
     * The final calculation (amountRemaining) is done in the service layer.
     */
    @Query("SELECT new com.budgetwise.api.dashboard.dto.BudgetProgress(" +
            "b.id, b.category.id, b.category.name, " +
            "(SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            " WHERE t.user = b.user AND t.category = b.category " +
            " AND FUNCTION('YEAR', t.transactionDate) = FUNCTION('YEAR', b.budgetMonth) " +
            " AND FUNCTION('MONTH', t.transactionDate) = FUNCTION('MONTH', b.budgetMonth)), " +
            "b.budgetAmount" +
            ") " +
            "FROM Budget b WHERE b.user = :user AND b.budgetMonth = :month")
    List<BudgetProgress> findBudgetProgressData(
            @Param("user") User user,
            @Param("month") LocalDate month
    );
}