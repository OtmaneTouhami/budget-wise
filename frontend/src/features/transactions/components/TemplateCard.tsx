import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";

import { useCurrency } from "@/hooks/use-currency";
import {
  useCreateTransactionFromTemplate,
  getGetTransactionsQueryKey,
} from "@/api/generated/hooks/transactions/transactions";
import {
  useDeleteTemplate,
  useUpdateTemplate,
  getGetAllUserTemplatesQueryKey,
} from "@/api/generated/hooks/transaction-templates/transaction-templates";
import type { TransactionTemplateResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";

import { useCategoryDetails } from "@/hooks/use-category-details";
import { hexToRgba } from "@/lib/utils";

import { TemplateForm } from "./TemplateForm";
import { EnterAmountModal } from "./EnterAmountModal";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

interface TemplateCardProps {
  template: TransactionTemplateResponse;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const queryClient = useQueryClient();
  const currencySymbol = useCurrency();

  const [isAmountModalOpen, setIsAmountModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const { data: categoryDetails, isLoading: isCategoryLoading } =
    useCategoryDetails(template.categoryId);

  const createFromTemplateMutation = useCreateTransactionFromTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

  const handleQuickAddClick = () => {
    if (template.amount) {
      createFromTemplateMutation.mutate(
        { templateId: template.id!, data: {} },
        {
          onSuccess: () => {
            toast.success(
              `Transaction from template "${template.name}" created.`
            );
            queryClient.invalidateQueries({
              queryKey: getGetTransactionsQueryKey(),
            });
          },
          onError: (err) =>
            toast.error((err as { data: ApiErrorResponse }).data.message),
        }
      );
    } else {
      setIsAmountModalOpen(true);
    }
  };

  const handleAmountModalSubmit = (values: { amount: number }) => {
    createFromTemplateMutation.mutate(
      { templateId: template.id!, data: values },
      {
        onSuccess: () => {
          toast.success(
            `Transaction from template "${template.name}" created.`
          );
          queryClient.invalidateQueries({
            queryKey: getGetTransactionsQueryKey(),
          });
          setIsAmountModalOpen(false);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  const handleUpdateSubmit = (values: any) => {
    updateTemplateMutation.mutate(
      { id: template.id!, data: values },
      {
        onSuccess: () => {
          toast.success("Template updated successfully.");
          queryClient.invalidateQueries({
            queryKey: getGetAllUserTemplatesQueryKey(),
          });
          setIsEditModalOpen(false);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  const handleDelete = () => {
    deleteTemplateMutation.mutate(
      { id: template.id! },
      {
        onSuccess: () => {
          toast.success("Template deleted successfully.");
          queryClient.invalidateQueries({
            queryKey: getGetAllUserTemplatesQueryKey(),
          });
          setIsDeleteModalOpen(false);
        },
        onError: (err) =>
          toast.error((err as { data: ApiErrorResponse }).data.message),
      }
    );
  };

  if (isCategoryLoading)
    return (
      <div className="h-20 w-40 animate-pulse rounded-lg bg-muted/50"></div>
    );

  const isIncome = categoryDetails?.categoryType === "INCOME";
  const categoryColor =
    categoryDetails?.color || (isIncome ? "#16a34a" : "#ef4444");
  const cardStyle = {
    backgroundColor: hexToRgba(categoryColor, 0.1),
    borderColor: hexToRgba(categoryColor, 0.4),
    color: categoryColor,
  };

  return (
    <>
      <div
        style={cardStyle}
        className="group relative flex h-20 w-40 flex-col rounded-lg border-2 border-dashed p-2 transition-all"
      >
        <button
          onClick={handleQuickAddClick}
          disabled={createFromTemplateMutation.isPending}
          className="flex h-full w-full flex-col items-center justify-center text-center font-semibold disabled:cursor-not-allowed"
        >
          <span>{template.name}</span>
          {template.amount && (
            <span className="text-sm font-normal opacity-80">
              {currencySymbol}
              {template.amount}
            </span>
          )}
        </button>
        <div className="absolute top-1 right-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-60 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteModalOpen(true)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EnterAmountModal
        isOpen={isAmountModalOpen}
        onClose={() => setIsAmountModalOpen(false)}
        onSubmit={handleAmountModalSubmit}
        isLoading={createFromTemplateMutation.isPending}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <TemplateForm
            onSubmit={handleUpdateSubmit}
            isLoading={updateTemplateMutation.isPending}
            initialData={template}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{template.name}" template?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTemplateMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
