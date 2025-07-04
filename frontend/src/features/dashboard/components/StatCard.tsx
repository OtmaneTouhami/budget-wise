import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

export const StatCard = ({
  title,
  value,
  icon,
  description,
  variant = "default",
}: StatCardProps) => {
  const currencySymbol = useCurrency();
  const valueColor =
    variant === "success"
      ? "text-green-600"
      : variant === "destructive"
        ? "text-red-600"
        : "text-foreground";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueColor)}>
          {currencySymbol}
          {value.toFixed(2)}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
