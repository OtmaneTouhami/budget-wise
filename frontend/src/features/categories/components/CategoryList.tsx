import {
  useGetAllUserCategories,
  useCreateCategory,
  getGetAllUserCategoriesQueryKey,
} from "@/api/generated/hooks/categories/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoryForm } from "./CategoryForm";
import { CategoryActions } from "./CategoryActions";
import type { ApiErrorResponse } from "@/types/error";

export const CategoryList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: categories, isLoading, error } = useGetAllUserCategories();
  const createMutation = useCreateCategory();
  const queryClient = useQueryClient();

  const onCreate = (values: any) => {
    createMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success(`Category "${values.name}" created.`);
          queryClient.invalidateQueries({
            queryKey: getGetAllUserCategoriesQueryKey(),
          });
          setIsCreateDialogOpen(false);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to create category.");
        },
      }
    );
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories.</div>;

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Category</DialogTitle>
              <DialogDescription>
                Categories help you organize your income and expenses.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              onSubmit={onCreate}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color || '#000' }}
                />
                {category.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {category.description}
              </TableCell>
              <TableCell>{category.categoryType}</TableCell>
              <TableCell className="text-right">
                <CategoryActions category={category} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {categories?.length === 0 && (
        <p className="mt-4 text-center text-muted-foreground">
          No categories found. Get started by creating one!
        </p>
      )}
    </div>
  );
};