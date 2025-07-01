package com.budgetwise.api.budget;

import com.budgetwise.api.category.Category;
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
    List<Budget> findByUserAndBudgetMonthBetween(User user, LocalDate startDate, LocalDate endDate);

    Optional<Budget> findByUserAndCategoryAndBudgetMonth(User user, Category category, LocalDate budgetMonth);

    @Query("SELECT b FROM Budget b WHERE b.autoRenew = true AND b.budgetMonth BETWEEN :startDate AND :endDate")
    List<Budget> findBudgetsToRenew(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}