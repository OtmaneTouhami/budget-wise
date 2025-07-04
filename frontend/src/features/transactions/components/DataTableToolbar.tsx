import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { X } from "lucide-react";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

export function DataTableToolbar<TData>({
  table,
  dateRange,
  setDateRange,
}: DataTableToolbarProps<TData>) {
  const categoryColumn = table.getColumn("categoryName");

  // A filter is active if the category is filtered OR if there is a date range
  const isFiltered = categoryColumn?.getIsFiltered() || !!dateRange;

  const handleCategoryChange = (value: string | undefined) => {
    categoryColumn?.setFilterValue(value);
  };

  // --- ENHANCED RESET FUNCTION ---
  const handleResetFilters = () => {
    table.resetColumnFilters(); // Resets category filter
    setDateRange(undefined); // Resets date range
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DateRangePicker date={dateRange} setDate={setDateRange} />
        <div className="w-[200px]">
          <CategoryCombobox
            value={categoryColumn?.getFilterValue() as string}
            onChange={handleCategoryChange}
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetFilters} // Use the new handler
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
