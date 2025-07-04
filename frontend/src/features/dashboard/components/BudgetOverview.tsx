import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/hooks/use-currency";
import type { BudgetProgress } from "@/api/generated/hooks/openAPIDefinition.schemas";

interface BudgetOverviewProps {
  data: BudgetProgress[];
}

export const BudgetOverview = ({ data }: BudgetOverviewProps) => {
  const currencySymbol = useCurrency();

  const { totalBudget, totalSpent, remaining, percentage } =
    React.useMemo(() => {
      const totalBudget = data.reduce(
        (sum, item) => sum + (item.budgetAmount || 0),
        0
      );
      const totalSpent = data.reduce(
        (sum, item) => sum + (item.amountSpent || 0),
        0
      );
      const remaining = totalBudget - totalSpent;
      const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      return { totalBudget, totalSpent, remaining, percentage };
    }, [data]);

  const progressColor =
    percentage > 100
      ? "bg-red-600"
      : percentage > 90
        ? "bg-yellow-500"
        : "bg-primary";

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No budgets set for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Budget</span>
            <span>
              {currencySymbol}
              {totalBudget.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Spent</span>
            <span className="text-red-600">
              {currencySymbol}
              {totalSpent.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Remaining</span>
            <span>
              {currencySymbol}
              {remaining.toFixed(2)}
            </span>
          </div>
        </div>
        <div>
          <Progress
            value={percentage > 100 ? 100 : percentage}
            indicatorClassName={progressColor}
          />
          <p className="text-right text-xs text-muted-foreground mt-1">
            {percentage.toFixed(1)}% spent
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
