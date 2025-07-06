import * as React from "react";
import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { X, Download } from "lucide-react";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { CategoryCombobox } from "@/features/categories/components/CategoryCombobox";
import { ExportTransactionsModal } from "./ExportTransactionsModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionResponseCategoryType } from "@/api/generated/hooks/openAPIDefinition.schemas";

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
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  const categoryColumn = table.getColumn("categoryName");
  const typeColumn = table.getColumn("categoryType");

  const isFiltered =
    categoryColumn?.getIsFiltered() ||
    typeColumn?.getIsFiltered() ||
    !!dateRange;

  const handleCategoryChange = (value: string | undefined) => {
    categoryColumn?.setFilterValue(value);
  };

  const handleTypeChange = (value: TransactionResponseCategoryType | "ALL") => {
    typeColumn?.setFilterValue(value === "ALL" ? undefined : value);
  };

  const handleResetFilters = () => {
    table.resetColumnFilters();
    setDateRange(undefined);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <Select
            value={(typeColumn?.getFilterValue() as string) ?? "ALL"}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-auto min-w-[120px]">
              <SelectValue placeholder="Filter by type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>


          <div className="w-[200px]">
            <CategoryCombobox
              value={categoryColumn?.getFilterValue() as string}
              onChange={handleCategoryChange}
              filterByType={
                typeColumn?.getFilterValue() as
                  | TransactionResponseCategoryType
                  | undefined
              }
            />
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          className="ml-2"
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <ExportTransactionsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
