import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import type { RecurringTransactionResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import {
  useUpdateStatus,
  getGetAllUserRecurringTransactionsQueryKey,
} from "@/api/generated/hooks/recurring-transactions/recurring-transactions";
import type { ApiErrorResponse } from "@/types/error";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface RecurringTransactionCardProps {
  rule: RecurringTransactionResponse;
  onEdit: () => void;
  onDelete: () => void;
}

export const RecurringTransactionCard = ({
  rule,
  onEdit,
  onDelete,
}: RecurringTransactionCardProps) => {
  const queryClient = useQueryClient();
  const currencySymbol = useCurrency();
  const updateStatusMutation = useUpdateStatus();

  const [isToggleLoading, setIsToggleLoading] = React.useState(false);
  const [showCannotDeleteAlert, setShowCannotDeleteAlert] =
    React.useState(false);

  const handleStatusChange = (isActive: boolean) => {
    setIsToggleLoading(true);
    updateStatusMutation.mutate(
      { id: rule.id!, data: { isActive } },
      {
        onSuccess: () => {
          toast.success(
            `Rule "${rule.name}" has been ${isActive ? "activated" : "deactivated"}.`
          );
          queryClient.invalidateQueries({
            queryKey: getGetAllUserRecurringTransactionsQueryKey(),
          });
        },
        onError: (err) => {
          toast.error((err as { data: ApiErrorResponse }).data.message);
        },
        onSettled: () => {
          setIsToggleLoading(false);
        },
      }
    );
  };

  const handleDeleteClick = () => {
    if (rule.active) {
      setShowCannotDeleteAlert(true);
    } else {
      onDelete();
    }
  };

  const isIncome =
    rule.categoryName?.toLowerCase().includes("income") ||
    rule.name?.toLowerCase().includes("salary");
  const amountColor = isIncome ? "text-green-600" : "text-red-600";

  return (
    <>
      <Card className={cn(!rule.active && "bg-muted/50 text-muted-foreground")}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{rule.name}</CardTitle>
            <Badge variant={rule.active ? "default" : "secondary"}>
              {rule.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription>
            Next execution on:{" "}
            {format(new Date(rule.nextExecutionDate!), "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className={cn("text-2xl font-bold", amountColor)}>
            {currencySymbol}
            {rule.amount?.toFixed(2)}
            <span className="text-sm font-medium text-muted-foreground ml-2 capitalize">
              / {rule.scheduleType?.toLowerCase()}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Category: {rule.categoryName}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id={`status-${rule.id}`}
              checked={rule.active}
              onCheckedChange={handleStatusChange}
              disabled={isToggleLoading}
            />
            <label htmlFor={`status-${rule.id}`}>Active</label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog
        open={showCannotDeleteAlert}
        onOpenChange={setShowCannotDeleteAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-destructive" />
              Cannot Delete Active Rule
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please deactivate this recurring rule first before attempting to
              delete it. This is a safeguard to prevent accidental deletion of
              active rules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowCannotDeleteAlert(false)}>
            Got it
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
