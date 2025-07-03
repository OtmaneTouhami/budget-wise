import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useUpdateBudget,
  getGetBudgetsQueryKey,
} from "@/api/generated/hooks/budgets/budgets";
import type { BudgetResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";

interface BudgetAutoRenewToggleProps {
  budget: BudgetResponse;
}

export const BudgetAutoRenewToggle = ({
  budget,
}: BudgetAutoRenewToggleProps) => {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateBudget();

  // The API requires the full budget object, so we construct it here.
  const handleToggle = (newAutoRenewValue: boolean) => {
    if (!budget.id || !budget.categoryId || !budget.budgetMonth) return;

    // We need to format the month from the budget response back into "YYYY-MM" format.
    const budgetMonthString = format(new Date(budget.budgetMonth), "yyyy-MM");

    const payload = {
      categoryId: budget.categoryId,
      budgetAmount: budget.budgetAmount!,
      budgetMonth: budgetMonthString,
      autoRenew: newAutoRenewValue,
    };

    updateMutation.mutate(
      { id: budget.id, data: payload },
      {
        onSuccess: () => {
          toast.success(`Budget for "${budget.categoryName}" updated.`);
          // Invalidate the query to refetch the budgets and update the UI
          queryClient.invalidateQueries({
            queryKey: getGetBudgetsQueryKey({
              year: new Date(budget.budgetMonth!).getFullYear(),
              month: new Date(budget.budgetMonth!).getMonth() + 1,
            }),
          });
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to update budget.");
        },
      }
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`auto-renew-${budget.id}`}
        checked={budget.autoRenew}
        onCheckedChange={handleToggle}
        disabled={updateMutation.isPending}
      />
      <Label htmlFor={`auto-renew-${budget.id}`} className="text-sm">
        Auto-Renew
      </Label>
    </div>
  );
};
