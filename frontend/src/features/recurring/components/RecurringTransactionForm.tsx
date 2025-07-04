import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecurringTransactionBody } from "@/api/generated/zod/recurring-transactions/recurring-transactions";
import {
  type RecurringTransactionResponse,
  TransactionResponseCategoryType,
} from "@/api/generated/hooks/openAPIDefinition.schemas";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";
import { useCategoryDetails } from "@/hooks/use-category-details";

const recurringTransactionSchema = createRecurringTransactionBody.extend({
  startDate: z
    .date({ required_error: "Start date is required." })
    .refine((date) => date > startOfToday(), {
      message: "Start date must be in the future.",
    }),
  endDate: z.date().optional(),
});
type RecurringTransactionSchema = z.infer<typeof recurringTransactionSchema>;

interface RecurringTransactionFormProps {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  initialData?: RecurringTransactionResponse;
}

// A small helper hook to get the category type from the initial data
const useInitialCategoryType = (initialData?: RecurringTransactionResponse) => {
  const { data: categoryDetails, isLoading } = useCategoryDetails(
    initialData?.categoryId
  );
  if (isLoading || !categoryDetails) return null;
  return categoryDetails.categoryType as TransactionResponseCategoryType;
};

export const RecurringTransactionForm = ({
  onSubmit,
  isLoading,
  initialData,
}: RecurringTransactionFormProps) => {
  const currencySymbol = useCurrency();
  const initialType = useInitialCategoryType(initialData);

  // State to manage the selected type (INCOME or EXPENSE)
  const [selectedType, setSelectedType] =
    React.useState<TransactionResponseCategoryType | null>(null);

  const form = useForm<RecurringTransactionSchema>({
    resolver: zodResolver(recurringTransactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      description: "",
      startDate: undefined,
      endDate: undefined,
      scheduleType: "MONTHLY",
      categoryId: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        amount: initialData.amount || 0,
        startDate: initialData.startDate
          ? new Date(initialData.startDate)
          : undefined,
        endDate: initialData.endDate
          ? new Date(initialData.endDate)
          : undefined,
      });
      // Set the initial type when editing
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

  const handleSubmit = (values: RecurringTransactionSchema) => {
    onSubmit({
      ...values,
      startDate: format(values.startDate, "yyyy-MM-dd"),
      endDate: values.endDate
        ? format(values.endDate, "yyyy-MM-dd")
        : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* --- ADDED: TYPE TOGGLE BUTTONS --- */}
        <FormItem>
          <FormLabel>Rule Type</FormLabel>
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
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Netflix Subscription" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- ADDED: CONDITIONAL CATEGORY COMBOBOX --- */}
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

        <div className="grid grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="scheduleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
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
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date <= new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
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
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= (form.getValues("startDate") || new Date())
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Rule"}
        </Button>
      </form>
    </Form>
  );
};
