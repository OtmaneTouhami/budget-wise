// --- File: frontend/src/features/transactions/components/TransactionForm.tsx ---
import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";
import { createTransactionBody } from "@/api/generated/zod/transactions/transactions";
import {
  type TransactionResponse,
  TransactionResponseCategoryType,
} from "@/api/generated/hooks/openAPIDefinition.schemas";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";

const transactionSchema = createTransactionBody.extend({
  transactionDate: z.date({ required_error: "Please select a date." }),
});
type TransactionSchema = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  initialData?: TransactionResponse;
}

export const TransactionForm = ({
  onSubmit,
  isLoading,
  initialData,
}: TransactionFormProps) => {
  const currencySymbol = useCurrency();
  const [selectedType, setSelectedType] =
    React.useState<TransactionResponseCategoryType | null>(
      (initialData?.categoryType as TransactionResponseCategoryType) || null
    );

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      transactionDate: new Date(),
      categoryId: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        amount: initialData.amount || 0,
        transactionDate: initialData.transactionDate
          ? new Date(initialData.transactionDate)
          : new Date(),
      });
    }
  }, [initialData, form]);

  const handleTypeChange = (type: TransactionResponseCategoryType) => {
    if (selectedType !== type) {
      form.setValue("categoryId", "");
    }
    setSelectedType(type);
  };

  const handleSubmit = (values: TransactionSchema) => {
    onSubmit({
      ...values,
      transactionDate: values.transactionDate.toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Transaction Type</FormLabel>
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  className="pl-8"
                />
              </div>
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

        {/* --- THIS IS THE CORRECTED SECTION --- */}
        <FormField
          control={form.control}
          name="transactionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Transaction Date</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* --- END OF CORRECTION --- */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coffee with friends" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Transaction"}
        </Button>
      </form>
    </Form>
  );
};
