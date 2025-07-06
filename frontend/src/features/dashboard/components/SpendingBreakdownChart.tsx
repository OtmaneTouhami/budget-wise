import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import type { CategorySpending } from "@/api/generated/hooks/openAPIDefinition.schemas";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
];

interface SpendingBreakdownChartProps {
  data: CategorySpending[];
}

export const SpendingBreakdownChart = ({
  data,
}: SpendingBreakdownChartProps) => {
  const currencySymbol = useCurrency();

  // Calculate total spending for percentage calculation
  const totalSpending = data.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  // Calculate percentage for each category
  const enhancedData = data.map((item) => ({
    ...item,
    percentage:
      totalSpending > 0 ? ((item.totalAmount || 0) / totalSpending) * 100 : 0,
  }));

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          Where your money goes - categorized spending analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data for this period.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[350px] lg:col-span-1 flex justify-center">
              <div className="w-full lg:w-[70%]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        background: "hsl(var(--background))",
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${currencySymbol}${value.toFixed(2)} (${props.payload.percentage.toFixed(1)}%)`,
                        name,
                      ]}
                    />
                    <Pie
                      data={enhancedData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={130}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="totalAmount"
                      nameKey="categoryName"
                      paddingAngle={2}
                    >
                      {enhancedData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="hsl(var(--background))"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-1 lg:pr-12">
              <h3 className="font-medium mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {enhancedData.map((entry, index) => (
                  <div key={`legend-${index}`} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="font-medium">
                          {entry.categoryName}
                        </span>
                      </div>
                      <span className="font-semibold">
                        {currencySymbol}
                        {entry.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${entry.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {entry.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
