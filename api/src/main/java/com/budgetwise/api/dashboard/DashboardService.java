package com.budgetwise.api.dashboard;

import com.budgetwise.api.dashboard.dto.DashboardStatsResponse;

import java.time.LocalDate;

public interface DashboardService {
    DashboardStatsResponse getDashboardStats(LocalDate startDate, LocalDate endDate);
}