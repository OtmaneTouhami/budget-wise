import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTemplateBody } from "@/api/generated/zod/transaction-templates/transaction-templates";
import {
  type TransactionTemplateResponse,
  TransactionResponseCategoryType,
} from "@/api/generated/hooks/openAPIDefinition.schemas";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";
import { useCategoryDetails } from "@/hooks/use-category-details";

const templateSchema = createTemplateBody;
type TemplateSchema = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  onSubmit: (values: TemplateSchema) => void;
  isLoading: boolean;
  initialData?: TransactionTemplateResponse;
}

// Helper hook to get the category type from the initial data for editing
const useInitialCategoryType = (initialData?: TransactionTemplateResponse) => {
  const { data: categoryDetails, isLoading } = useCategoryDetails(
    initialData?.categoryId
  );
  if (isLoading || !categoryDetails) return null;
  return categoryDetails.categoryType as TransactionResponseCategoryType;
};

export const TemplateForm = ({
  onSubmit,
  isLoading,
  initialData,
}: TemplateFormProps) => {
  const currencySymbol = useCurrency();
  const initialType = useInitialCategoryType(initialData);

  // State to manage the selected type (INCOME or EXPENSE)
  const [selectedType, setSelectedType] =
    React.useState<TransactionResponseCategoryType | null>(null);

  const form = useForm<TemplateSchema>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      description: "",
      categoryId: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        amount: initialData.amount || undefined,
        description: initialData.description || "",
      });
      // Set the initial type when the dialog opens for editing
      if (initialType) {
        setSelectedType(initialType);
      }
    }
  }, [initialData, initialType, form]);

  const handleTypeChange = (type: TransactionResponseCategoryType) => {
    if (selectedType !== type) {
      form.setValue("categoryId", ""); // Reset category when type changes
    }
    setSelectedType(type);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Template Type</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={selectedType === "INCOME" ? "default" : "outline"}
              onClick={() => handleTypeChange("INCOME")}
              className={cn(
                selectedType === "INCOME" && "bg-green-600 hover:bg-green-700"
              )}
            >
              Income
            </Button>
            <Button
              type="button"
              variant={selectedType === "EXPENSE" ? "default" : "outline"}
              onClick={() => handleTypeChange("EXPENSE")}
              className={cn(
                selectedType === "EXPENSE" && "bg-red-600 hover:bg-red-700"
              )}
            >
              Expense
            </Button>
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coffee, Lunch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType && (
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
                    filterByType={selectedType}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (Optional)</FormLabel>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || undefined)
                  }
                  className="pl-8"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Daily latte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Template"}
        </Button>
      </form>
    </Form>
  );
};
