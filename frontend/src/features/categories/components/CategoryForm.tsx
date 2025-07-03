import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategoryBody } from "@/api/generated/zod/categories/categories";
import type { CategoryResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";

// Use the generated Zod schema for validation
const categorySchema = createCategoryBody;
type CategorySchema = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (values: CategorySchema) => void;
  isLoading: boolean;
  initialData?: CategoryResponse; // Optional initial data for editing
}

export const CategoryForm = ({
  onSubmit,
  isLoading,
  initialData,
}: CategoryFormProps) => {
  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      categoryType: "EXPENSE", // Default to EXPENSE
      color: "#000000",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries, Salary" {...field} />
              </FormControl>
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
                <Input placeholder="e.g., Weekly food shopping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="#RRGGBB"
                      {...field}
                      className="pl-10"
                    />
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer appearance-none rounded-full border-none bg-transparent"
                      style={{ backgroundColor: field.value }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Category"}
        </Button>
      </form>
    </Form>
  );
};
