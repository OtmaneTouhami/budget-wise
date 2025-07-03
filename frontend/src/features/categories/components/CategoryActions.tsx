// --- File: frontend/src/features/categories/components/CategoryActions.tsx ---
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import {
  useUpdateCategory,
  useDeleteCategory,
  getGetAllUserCategoriesQueryKey,
} from "@/api/generated/hooks/categories/categories";
import type { CategoryResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import type { ApiErrorResponse } from "@/types/error";

interface CategoryActionsProps {
  category: CategoryResponse;
}

export const CategoryActions = ({ category }: CategoryActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const onUpdate = (values: any) => {
    if (!category.id) return;
    updateMutation.mutate(
      { id: category.id, data: values },
      {
        onSuccess: () => {
          toast.success(`Category "${values.name}" updated.`);
          queryClient.invalidateQueries({
            queryKey: getGetAllUserCategoriesQueryKey(),
          });
          setIsEditDialogOpen(false);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to update category.");
        },
      }
    );
  };

  const onDelete = () => {
    if (!category.id) return;
    deleteMutation.mutate(
      { id: category.id },
      {
        onSuccess: () => {
          toast.success(`Category "${category.name}" deleted.`);
          queryClient.invalidateQueries({
            queryKey: getGetAllUserCategoriesQueryKey(),
          });
          setIsDeleteDialogOpen(false);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          // Your backend prevents deleting categories with transactions, so handle that specific error.
          toast.error(apiError.data?.message || "Failed to delete category.");
        },
      }
    );
  };

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setIsDeleteDialogOpen(true)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the details of your category.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmit={onUpdate}
            isLoading={updateMutation.isPending}
            initialData={category}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-bold"> "{category.name}" </span> category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onDelete}
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
