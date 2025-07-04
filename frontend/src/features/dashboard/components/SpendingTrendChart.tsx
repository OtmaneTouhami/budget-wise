import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import type { DailySpending } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { format } from "date-fns";

interface SpendingTrendChartProps {
  data: DailySpending[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const currencySymbol = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold">{`${label} : ${currencySymbol}${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export const SpendingTrendChart = ({ data }: SpendingTrendChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: format(new Date(item.date!), "MMM dd"),
  }));

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No spending data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalAmount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
