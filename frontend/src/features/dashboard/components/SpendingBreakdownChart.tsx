import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import type { CategorySpending } from "@/api/generated/hooks/openAPIDefinition.schemas";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#775DD0"];

interface SpendingBreakdownChartProps {
  data: CategorySpending[];
}

export const SpendingBreakdownChart = ({ data }: SpendingBreakdownChartProps) => {
  const currencySymbol = useCurrency();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data for this period.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ borderRadius: "0.5rem", background: "hsl(var(--background))" }}
                    formatter={(value: number) => `${currencySymbol}${value.toFixed(2)}`}
                  />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalAmount"
                    nameKey="categoryName"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              {data.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}/>
                    <span className="text-sm text-muted-foreground">{entry.categoryName}</span>
                  </div>
                  <span className="font-semibold text-sm">{currencySymbol}{entry.totalAmount?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};