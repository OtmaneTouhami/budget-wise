import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTemplateBody } from "@/api/generated/zod/transaction-templates/transaction-templates";
import type { TransactionTemplateResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";

const templateSchema = createTemplateBody;
type TemplateSchema = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  onSubmit: (values: TemplateSchema) => void;
  isLoading: boolean;
  initialData?: TransactionTemplateResponse;
}

export const TemplateForm = ({ onSubmit, isLoading, initialData }: TemplateFormProps) => {
  const currencySymbol = useCurrency();

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
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control} name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl><Input placeholder="e.g., Coffee, Lunch" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control} name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                {/* Note: No type filter, templates can be for any category */}
                <CategoryCombobox value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control} name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (Optional)</FormLabel>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">{currencySymbol}</span>
                <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} className="pl-8"/>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control} name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., Daily latte" {...field} /></FormControl>
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