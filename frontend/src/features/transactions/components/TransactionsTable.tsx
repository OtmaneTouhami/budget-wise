import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, Table as TanstackTable } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import {
  useGetTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  getGetTransactionsQueryKey,
} from "@/api/generated/hooks/transactions/transactions";
import type { TransactionResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { TransactionForm } from "./TransactionForm";
import { DataTableToolbar } from "./DataTableToolbar";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

export const TransactionsTable = () => {
  const queryClient = useQueryClient();
  const currencySymbol = useCurrency();

  // State management for filters and modals
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingTx, setEditingTx] = React.useState<TransactionResponse | null>(
    null
  );
  const [deletingTx, setDeletingTx] =
    React.useState<TransactionResponse | null>(null);
  const [detailsTx, setDetailsTx] = React.useState<TransactionResponse | null>(
    null
  );

  // Data fetching hook for transactions, reacts to dateRange changes
  const { data: transactions, isLoading } = useGetTransactions({
    startDate: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  // API mutation hooks
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  // Handler functions for CRUD operations
  const handleCreate = (values: any) => {
    createMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success("Transaction created.");
          queryClient.invalidateQueries({
            queryKey: getGetTransactionsQueryKey(),
          });
          setIsCreateOpen(false);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  const handleUpdate = (values: any) => {
    if (!editingTx?.id) return;
    updateMutation.mutate(
      { id: editingTx.id, data: values },
      {
        onSuccess: () => {
          toast.success("Transaction updated.");
          queryClient.invalidateQueries({
            queryKey: getGetTransactionsQueryKey(),
          });
          setEditingTx(null);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  const handleDelete = () => {
    if (!deletingTx?.id) return;
    deleteMutation.mutate(
      { id: deletingTx.id },
      {
        onSuccess: () => {
          toast.success("Transaction deleted.");
          queryClient.invalidateQueries({
            queryKey: getGetTransactionsQueryKey(),
          });
          setDeletingTx(null);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  // Column definitions for the data table
  const columns: ColumnDef<TransactionResponse>[] = [
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.getValue("transactionDate")), "PPP"),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[250px] truncate" title={description}>
            {description || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      filterFn: (row, value) => {
        return value === row.original.categoryId;
      },
    },
    {
      accessorKey: "categoryType",
      header: "Type",
      filterFn: (row, id, value) => {
        return value === row.getValue(id);
      },
      cell: ({ row }) => {
        const isIncome = row.getValue("categoryType") === "INCOME";
        return (
          <Badge
            variant={isIncome ? "default" : "destructive"}
            className={cn(isIncome && "bg-green-600 hover:bg-green-600")}
          >
            {row.getValue("categoryType")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const type = row.original.categoryType;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        })
          .format(amount)
          .replace("$", currencySymbol);

        const isIncome = type === "INCOME";
        const sign = isIncome ? "+" : "-";
        const colorClass = isIncome ? "text-green-600" : "text-red-600";

        return (
          <div className={cn("text-right font-medium", colorClass)}>
            {sign}
            {formatted}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setDetailsTx(row.original)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditingTx(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setDeletingTx(row.original)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={transactions || []}
        columns={columns}
        isLoading={isLoading}
        ToolbarComponent={(table: TanstackTable<TransactionResponse>) => (
          <div className="flex items-center justify-between gap-2.5">
            <DataTableToolbar
              table={table}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>Add Transaction</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Transaction</DialogTitle>
                </DialogHeader>
                <TransactionForm
                  onSubmit={handleCreate}
                  isLoading={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      />

      <TransactionDetailsModal
        transaction={detailsTx}
        isOpen={!!detailsTx}
        onClose={() => setDetailsTx(null)}
      />

      <Dialog
        open={!!editingTx}
        onOpenChange={(isOpen) => !isOpen && setEditingTx(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            initialData={editingTx!}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingTx}
        onOpenChange={(isOpen) => !isOpen && setDeletingTx(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          Are you sure you want to delete this transaction? This action cannot
          be undone.
          <DialogFooter className="mt-4">
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
    </>
  );
};
