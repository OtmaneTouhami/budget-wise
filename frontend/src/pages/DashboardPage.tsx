import * as React from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  AlertCircle,
} from "lucide-react";
import { useGetDashboardStats } from "@/api/generated/hooks/dashboard/dashboard";
import { useAuthStore } from "@/store/auth-store";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { StatCard } from "@/features/dashboard/components/StatCard";
import { SpendingBreakdownChart } from "@/features/dashboard/components/SpendingBreakdownChart";
import { SpendingTrendChart } from "@/features/dashboard/components/SpendingTrendChart";
import { BudgetOverview } from "@/features/dashboard/components/BudgetOverview";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";

export const DashboardPage = () => {
  const { user, accessToken } = useAuthStore();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetDashboardStats(
    {
      startDate: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      endDate: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
    },
    {
      query: { enabled: !!accessToken },
    }
  );

  const { expenseChange, budgetRemaining } = React.useMemo(() => {
    if (!dashboardData) return { expenseChange: null, budgetRemaining: 0 };

    const expenseChange =
      !dashboardData.totalExpense ||
      !dashboardData.previousPeriodExpense ||
      dashboardData.previousPeriodExpense === 0
        ? null
        : ((dashboardData.totalExpense - dashboardData.previousPeriodExpense) /
            dashboardData.previousPeriodExpense) *
          100;

    const totalBudget =
      dashboardData.budgetProgress?.reduce(
        (sum, item) => sum + (item.budgetAmount || 0),
        0
      ) || 0;
    const totalSpent =
      dashboardData.budgetProgress?.reduce(
        (sum, item) => sum + (item.amountSpent || 0),
        0
      ) || 0;
    const budgetRemaining = totalBudget - totalSpent;

    return { expenseChange, budgetRemaining };
  }, [dashboardData]);

  if (isLoading) return <div className="p-4">Loading dashboard...</div>;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dashboard data.</AlertDescription>
      </Alert>
    );
  if (!dashboardData)
    return <div className="p-4">No data available for this period.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's your overview for{" "}
            {format(date?.from || new Date(), "MMMM yyyy")}.
          </p>
        </div>
        <DateRangePicker date={date} setDate={setDate} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Income"
          value={dashboardData.totalIncome || 0}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          variant="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={dashboardData.totalExpense || 0}
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
          variant="destructive"
          description={
            expenseChange !== null
              ? `${expenseChange > 0 ? "+" : ""}${expenseChange.toFixed(1)}% from last period`
              : "No comparison data"
          }
        />
        <StatCard
          title="Net Balance"
          value={dashboardData.netSavings || 0}
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Budget Remaining"
          value={budgetRemaining}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          variant={budgetRemaining >= 0 ? "default" : "destructive"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingTrendChart data={dashboardData.spendingTrend || []} />
        </div>
        <div className="lg:col-span-1">
          <SpendingBreakdownChart data={dashboardData.expenseBreakdown || []} />
        </div>
        <div className="lg:col-span-1">
          <BudgetOverview data={dashboardData.budgetProgress || []} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};
