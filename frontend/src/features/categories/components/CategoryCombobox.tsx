import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  useGetAllUserCategories,
  useCreateCategory,
  getGetAllUserCategoriesQueryKey,
} from "@/api/generated/hooks/categories/categories";
import { CategoryForm } from "./CategoryForm";
import type { ApiErrorResponse } from "@/types/error";

interface CategoryComboboxProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  // Prop to receive IDs of categories that should be disabled (e.g., already have a budget)
  excludedCategoryIds?: string[];
}

export function CategoryCombobox({
  value,
  onChange,
  disabled,
  excludedCategoryIds = [],
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const queryClient = useQueryClient();
  // --- FIX: Explicitly get isLoading and error states ---
  const { data: allCategories, isLoading, error } = useGetAllUserCategories();
  const createCategoryMutation = useCreateCategory();

const expenseCategories = React.useMemo(
    () =>
      allCategories?.filter(
        (cat) => (cat.categoryType || "").toUpperCase() === "EXPENSE"
      ) || [],
    [allCategories]
  );
  const selectedCategory = expenseCategories.find(
    (category) => category.id === value
  );

  // --- FIX: Handle loading and error states in the UI ---
  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-start">
        Loading categories...
      </Button>
    );
  }

  if (error) {
    console.error("Failed to load categories:", error);
    return (
      <Button variant="destructive" disabled className="w-full justify-start">
        Error loading categories
      </Button>
    );
  }

  const handleCreateCategory = (values: any) => {
    createCategoryMutation.mutate(
      { data: { ...values, categoryType: "EXPENSE" } },
      {
        onSuccess: (newCategory) => {
          toast.success(`Category "${newCategory.name}" created.`);
          queryClient.invalidateQueries({
            queryKey: getGetAllUserCategoriesQueryKey(),
          });
          setIsCreateDialogOpen(false);
          onChange(newCategory.id);
          setOpen(false);
        },
        onError: (error) => {
          const apiError = error as { data: ApiErrorResponse };
          toast.error(apiError.data?.message || "Failed to create category.");
        },
      }
    );
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedCategory
              ? selectedCategory.name
              : "Select an expense category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search or create category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {expenseCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    // --- FIX: Disable item if its ID is in the excluded list ---
                    disabled={excludedCategoryIds.includes(category.id!)}
                    onSelect={() => {
                      onChange(category.id);
                      setOpen(false);
                    }}
                    className={cn(
                      excludedCategoryIds.includes(category.id!) &&
                        "text-muted-foreground/50 cursor-not-allowed"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-primary">Create new category</span>
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Expense Category</DialogTitle>
        </DialogHeader>
        <CategoryForm
          onSubmit={handleCreateCategory}
          isLoading={createCategoryMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
