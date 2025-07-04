import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/hooks/use-currency";
import type { BudgetProgress } from "@/api/generated/hooks/openAPIDefinition.schemas";

interface BudgetProgressListProps {
  data: BudgetProgress[];
}

export const BudgetProgressList = ({ data }: BudgetProgressListProps) => {
  const currencySymbol = useCurrency();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>
          Your spending vs. your budget limits for this period.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No budgets set for this month.
          </p>
        ) : (
          data.map((item) => {
            const percentage =
              item.budgetAmount! > 0
                ? (item.amountSpent! / item.budgetAmount!) * 100
                : 0;
            const progressColor =
              percentage > 90
                ? "bg-red-600"
                : percentage > 70
                  ? "bg-yellow-500"
                  : "bg-primary";
            return (
              <div key={item.budgetId}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">{item.categoryName}</span>
                  <span>
                    {currencySymbol}
                    {item.amountSpent?.toFixed(2)} / {currencySymbol}
                    {item.budgetAmount?.toFixed(2)}
                  </span>
                </div>
                <Progress value={percentage} className={progressColor} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
