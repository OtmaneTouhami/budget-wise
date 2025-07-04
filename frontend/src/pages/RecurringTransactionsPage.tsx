import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  useGetAllUserRecurringTransactions,
  useCreateRecurringTransaction,
  useUpdateRecurringTransaction,
  useDeleteRecurringTransaction,
  getGetAllUserRecurringTransactionsQueryKey,
} from "@/api/generated/hooks/recurring-transactions/recurring-transactions";
import type { RecurringTransactionResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";

import { RecurringTransactionCard } from "@/features/recurring/components/RecurringTransactionCard";
import { RecurringTransactionForm } from "@/features/recurring/components/RecurringTransactionForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

export const RecurringTransactionsPage = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingRule, setEditingRule] =
    React.useState<RecurringTransactionResponse | null>(null);
  const [deletingRule, setDeletingRule] =
    React.useState<RecurringTransactionResponse | null>(null);

  const { data: rules, isLoading } = useGetAllUserRecurringTransactions();
  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();
  const deleteMutation = useDeleteRecurringTransaction();

  const handleCreate = (values: any) => {
    createMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success("Recurring rule created successfully!");
          queryClient.invalidateQueries({
            queryKey: getGetAllUserRecurringTransactionsQueryKey(),
          });
          setIsCreateOpen(false);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  const handleUpdate = (values: any) => {
    if (!editingRule?.id) return;
    updateMutation.mutate(
      { id: editingRule.id, data: values },
      {
        onSuccess: () => {
          toast.success("Recurring rule updated successfully!");
          queryClient.invalidateQueries({
            queryKey: getGetAllUserRecurringTransactionsQueryKey(),
          });
          setEditingRule(null);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  const handleDelete = () => {
    if (!deletingRule?.id) return;
    deleteMutation.mutate(
      { id: deletingRule.id },
      {
        onSuccess: () => {
          toast.success("Recurring rule deleted successfully!");
          queryClient.invalidateQueries({
            queryKey: getGetAllUserRecurringTransactionsQueryKey(),
          });
          setDeletingRule(null);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Recurring Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Automate your regular income and expenses.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Recurring Rule</DialogTitle>
            </DialogHeader>
            <RecurringTransactionForm
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />

      {isLoading && <p>Loading rules...</p>}
      {!isLoading && rules?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
          <h3 className="text-xl font-semibold">No Recurring Rules Found</h3>
          <p className="text-muted-foreground">
            Automate your finances by creating your first rule.
          </p>
          <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
            Create a Rule
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {rules?.map((rule) => (
          <RecurringTransactionCard
            key={rule.id}
            rule={rule}
            onEdit={() => setEditingRule(rule)}
            onDelete={() => setDeletingRule(rule)}
          />
        ))}
      </div>

      <Dialog
        open={!!editingRule}
        onOpenChange={(isOpen) => !isOpen && setEditingRule(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recurring Rule</DialogTitle>
          </DialogHeader>
          <RecurringTransactionForm
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            initialData={editingRule!}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingRule}
        onOpenChange={(isOpen) => !isOpen && setDeletingRule(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{deletingRule?.name}" rule?
              This cannot be undone.
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
