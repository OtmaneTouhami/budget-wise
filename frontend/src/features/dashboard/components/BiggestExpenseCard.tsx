import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import type { TopTransaction } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { ShoppingCart } from "lucide-react";
import { format } from "date-fns";

interface BiggestExpenseCardProps {
  data: TopTransaction | undefined | null;
}

export const BiggestExpenseCard = ({ data }: BiggestExpenseCardProps) => {
  const currencySymbol = useCurrency();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          Top Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <div>
            <p className="text-2xl font-bold text-red-600">
              {currencySymbol}
              {data.amount?.toFixed(2)}
            </p>
            <p className="text-sm truncate" title={data.description || ""}>
              {data.description || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(data.transactionDate!), "PPP")}
            </p>
          </div>
        ) : (
          <div className="flex h-[80px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No expense data for this period.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
