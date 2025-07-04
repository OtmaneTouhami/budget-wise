import { useGetTransactions } from "@/api/generated/hooks/transactions/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { format } from "date-fns";

export const RecentTransactions = () => {
  const currencySymbol = useCurrency();
  // Fetch all transactions and I will slice the latest 5 on the frontend.
  // In a production app with heavy data, I might add a limit parameter to the backend API.
  const { data: transactions, isLoading } = useGetTransactions();

  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading...</p>}
        {!isLoading && recentTransactions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No transactions recorded yet.
          </p>
        )}
        <div className="space-y-4">
          {recentTransactions.map((tx) => {
            const isIncome = tx.categoryType === "INCOME";
            return (
              <div key={tx.id} className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  {isIncome ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {tx.categoryName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {tx.description || "No description"}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p
                    className={cn(
                      "font-medium text-sm",
                      isIncome ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {currencySymbol}
                    {tx.amount?.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(tx.transactionDate!), "MMM dd")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
