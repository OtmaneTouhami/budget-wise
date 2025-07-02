package com.budgetwise.api.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netSavings;
    private List<CategorySpending> expenseBreakdown; // For the pie chart
    private List<DailySpending> spendingTrend;       // For the line/bar chart
    private List<BudgetProgress> budgetProgress;
    private BigDecimal previousPeriodExpense;
    private TopTransaction biggestExpense;
}
