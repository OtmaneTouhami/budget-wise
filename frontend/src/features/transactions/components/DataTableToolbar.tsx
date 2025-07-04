import * as React from "react";
import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { X, Download } from "lucide-react";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";
import { ExportTransactionsModal } from "./ExportTransactionsModal";

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
  // --- STATE FOR THE MODAL ---
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  const categoryColumn = table.getColumn("categoryName");
  const isFiltered = categoryColumn?.getIsFiltered() || !!dateRange;

  const handleCategoryChange = (value: string | undefined) => {
    categoryColumn?.setFilterValue(value);
  }

  const handleResetFilters = () => {
    table.resetColumnFilters();
    setDateRange(undefined);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <div className="w-[200px]">
            <CategoryCombobox 
              value={categoryColumn?.getFilterValue() as string}
              onChange={handleCategoryChange}
            />
          </div>
          {isFiltered && (
            <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 lg:px-3">
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* --- ADD THE EXPORT BUTTON --- */}
        <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
        </Button>
      </div>

      {/* --- RENDER THE MODAL --- */}
      <ExportTransactionsModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}