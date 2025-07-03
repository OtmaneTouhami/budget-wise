// --- File: frontend/src/features/budgets/components/BudgetForm.tsx ---
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createBudgetBody } from "@/api/generated/zod/budgets/budgets";
import type { BudgetResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";

const budgetFormSchema = createBudgetBody.omit({ budgetMonth: true });
type BudgetFormSchema = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  onSubmit: (values: BudgetFormSchema) => void;
  isLoading: boolean;
  initialData?: BudgetResponse;
  // --- FIX: Add this prop back to receive the IDs ---
  excludedCategoryIds?: string[];
}

export const BudgetForm = ({
  onSubmit,
  isLoading,
  initialData,
  // --- FIX: Destructure the prop ---
  excludedCategoryIds = [],
}: BudgetFormProps) => {
  const form = useForm<BudgetFormSchema>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: undefined,
      budgetAmount: 0,
      autoRenew: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        categoryId: initialData.categoryId,
        budgetAmount: initialData.budgetAmount,
        autoRenew: initialData.autoRenew,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryCombobox
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading || !!initialData}
                  // --- FIX: Pass the excluded IDs to the combobox ---
                  excludedCategoryIds={excludedCategoryIds}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budgetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 500"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoRenew"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Auto-Renew Budget</FormLabel>
                <FormDescription>
                  If checked, this budget will be automatically created for the
                  next month.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Budget"}
        </Button>
      </form>
    </Form>
  );
};
