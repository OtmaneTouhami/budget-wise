import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, startOfMonth } from "date-fns";

import {
  useGetBudgets,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
  getGetBudgetsQueryKey,
} from "@/api/generated/hooks/budgets/budgets";
import type { BudgetResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";

import { useCurrency } from "@/hooks/use-currency";
import { BudgetAutoRenewToggle } from "@/features/budgets/components/BudgetAutoRenewToggle";
import { MonthYearPicker } from "@/features/budgets/components/MonthYearPicker";
import { BudgetForm } from "@/features/budgets/components/BudgetForm";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const BudgetsPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetResponse | null>(
    null
  );
  const [deletingBudget, setDeletingBudget] = useState<BudgetResponse | null>(
    null
  );

  const queryClient = useQueryClient();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const currencySymbol = useCurrency();

  const startOfCurrentMonth = startOfMonth(new Date());
  const startOfViewingMonth = startOfMonth(currentDate);
  const isViewingPastMonth = startOfViewingMonth < startOfCurrentMonth;

  
  const { data: budgets, isLoading } = useGetBudgets({ year, month });
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  const budgetMonthString = format(currentDate, "yyyy-MM");

  const handleCreate = (values: any) => {
    createMutation.mutate(
      { data: { ...values, budgetMonth: budgetMonthString } },
      {
        onSuccess: () => {
          toast.success("Budget created successfully!");
          queryClient.invalidateQueries({
            queryKey: getGetBudgetsQueryKey({ year, month }),
          });
          setIsCreateOpen(false);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to create budget.");
        },
      }
    );
  };

  const handleUpdate = (values: any) => {
    if (!editingBudget?.id) return;
    const monthStr = format(new Date(editingBudget.budgetMonth!), "yyyy-MM");
    updateMutation.mutate(
      { id: editingBudget.id, data: { ...values, budgetMonth: monthStr } },
      {
        onSuccess: () => {
          toast.success("Budget updated successfully!");
          queryClient.invalidateQueries({
            queryKey: getGetBudgetsQueryKey({ year, month }),
          });
          setEditingBudget(null);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to update budget.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deletingBudget?.id) return;
    deleteMutation.mutate(
      { id: deletingBudget.id },
      {
        onSuccess: () => {
          toast.success("Budget deleted successfully!");
          queryClient.invalidateQueries({
            queryKey: getGetBudgetsQueryKey({ year, month }),
          });
          setDeletingBudget(null);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to delete budget.");
        },
      }
    );
  };

  const budgetedCategoryIds = budgets?.map((b) => b.categoryId!) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monthly Budgets</h1>
          <p className="text-sm text-muted-foreground">
            Set and manage your spending limits for each category.
          </p>
        </div>
        <MonthYearPicker
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={isViewingPastMonth}>Create Budget</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a New Budget</DialogTitle>
                      <DialogDescription>
                        Set a spending limit for an expense category for{" "}
                        {format(currentDate, "MMMM yyyy")}.
                      </DialogDescription>
                    </DialogHeader>
                    <BudgetForm
                      onSubmit={handleCreate}
                      isLoading={createMutation.isPending}
                      excludedCategoryIds={budgetedCategoryIds}
                    />
                  </DialogContent>
                </Dialog>
              </span>
            </TooltipTrigger>
            {isViewingPastMonth && (
              <TooltipContent>
                <p>Cannot create budgets for past months.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />

      {isLoading && <p>Loading budgets...</p>}

      {!isLoading && budgets?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
          <h3 className="text-xl font-semibold">No Budgets Found</h3>
          <p className="text-muted-foreground">
            You haven't set any budgets for {format(currentDate, "MMMM yyyy")}.
          </p>
          <Button
            className="mt-4"
            disabled={isViewingPastMonth}
            onClick={() => setIsCreateOpen(true)}
          >
            Create a Budget
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets?.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle>{budget.categoryName}</CardTitle>
              <CardDescription>Monthly Budget</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {currencySymbol}
                {budget.budgetAmount?.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <BudgetAutoRenewToggle budget={budget} />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingBudget(budget)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingBudget(budget)}
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!editingBudget}
        onOpenChange={(isOpen) => !isOpen && setEditingBudget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            initialData={editingBudget!}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingBudget}
        onOpenChange={(isOpen) => !isOpen && setDeletingBudget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the budget for "
              {deletingBudget?.categoryName}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
