package com.budgetwise.api.dashboard.impl;

import com.budgetwise.api.budget.BudgetRepository;
import com.budgetwise.api.category.enums.CategoryType;
import com.budgetwise.api.dashboard.DashboardService;
import com.budgetwise.api.dashboard.dto.*;
import com.budgetwise.api.security.SecurityUtils;
import com.budgetwise.api.transaction.TransactionRepository;
import com.budgetwise.api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final SecurityUtils securityUtils;

    @Override
    public DashboardStatsResponse getDashboardStats(LocalDate startDate, LocalDate endDate) {
        User currentUser = securityUtils.getCurrentUser();

        // If no dates are provided, default to the current month
        if (startDate == null || endDate == null) {
            YearMonth currentMonth = YearMonth.now();
            startDate = currentMonth.atDay(1);
            endDate = currentMonth.atEndOfMonth();
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        // 1. Fetch Total Income and Expense
        BigDecimal totalIncome = transactionRepository.sumAmountByCategoryType(
                currentUser, CategoryType.INCOME, startDateTime, endDateTime);
        BigDecimal totalExpense = transactionRepository.sumAmountByCategoryType(
                currentUser, CategoryType.EXPENSE, startDateTime, endDateTime);

        // 2. Fetch Expense Breakdown by Category
        List<CategorySpending> expenseBreakdown = transactionRepository.findExpenseBreakdownByCategory(
                currentUser, startDateTime, endDateTime);

        // 3. Fetch Spending Trend by Day
        List<DailySpending> spendingTrend = transactionRepository.findSpendingTrendByDay(
                currentUser, startDateTime, endDateTime);

        // --- LOGIC FOR COMPARATIVE PERIOD ---
        long daysInPeriod = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        LocalDate previousStartDate = startDate.minusDays(daysInPeriod);
        LocalDate previousEndDate = endDate.minusDays(daysInPeriod);

        BigDecimal previousPeriodExpense = transactionRepository.sumAmountByCategoryType(
                currentUser, CategoryType.EXPENSE,
                previousStartDate.atStartOfDay(),
                previousEndDate.plusDays(1).atStartOfDay()
        );

        // --- ADD LOGIC FOR TOP TRANSACTION ---
        TopTransaction biggestExpense = transactionRepository.findTopExpenseTransaction(
                currentUser, startDateTime, endDateTime);

        // For budget progress, we typically show it for the month of the start date.
        // 1. Fetch the raw progress data from the repository
        LocalDate budgetMonth = startDate.withDayOfMonth(1);
        List<BudgetProgress> budgetProgressData = budgetRepository.findBudgetProgressData(currentUser, budgetMonth);

        // 2. Iterate and perform the final calculation
        budgetProgressData.forEach(progress -> {
            BigDecimal remaining = progress.getBudgetAmount().subtract(progress.getAmountSpent());
            progress.setAmountRemaining(remaining);
        });

        // 4. Build the final response DTO
        return DashboardStatsResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netSavings(totalIncome.subtract(totalExpense))
                .expenseBreakdown(expenseBreakdown)
                .spendingTrend(spendingTrend)
                .budgetProgress(budgetProgressData)
                .previousPeriodExpense(previousPeriodExpense)
                .biggestExpense(biggestExpense)
                .build();
    }
}