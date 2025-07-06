import * as React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Download, FileClock, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { instance as axiosInstance } from "@/api/api-client"; 

interface ExportTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTransactionsModal = ({
  isOpen,
  onClose,
}: ExportTransactionsModalProps) => {
  const [step, setStep] = React.useState<"initial" | "date_range">("initial");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset state when the dialog is closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("initial");
        setDateRange(undefined);
      }, 200); // Delay to allow for closing animation
    }
  }, [isOpen]);

  const handleExport = async (
    params: { startDate?: string; endDate?: string } = {}
  ) => {
    setIsLoading(true);
    toast.info("Preparing your export. This may take a moment...");

    try {
      // Prepare the parameters for the export
      const response = await axiosInstance.get("/transactions/export", {
        params,
        responseType: "blob",
      });

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      const fileName = `budgetwise_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
      link.setAttribute("download", fileName);

      // Append to the DOM, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the object URL
      window.URL.revokeObjectURL(url);

      toast.success("Your export has started downloading!");
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
          <DialogDescription>
            Choose how you'd like to export your transaction data to a CSV file.
          </DialogDescription>
        </DialogHeader>

        {step === "initial" && (
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-20"
              onClick={() => handleExport()}
            >
              <ListChecks className="mr-2 h-5 w-5" />
              Export All
            </Button>
            <Button
              variant="outline"
              className="h-20"
              onClick={() => setStep("date_range")}
            >
              <FileClock className="mr-2 h-5 w-5" />
              Select Range
            </Button>
          </div>
        )}

        {step === "date_range" && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <DateRangePicker date={dateRange} setDate={setDateRange} />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setStep("initial")}>
                Back
              </Button>
              <Button
                onClick={() =>
                  handleExport({
                    startDate: dateRange?.from
                      ? format(dateRange.from, "yyyy-MM-dd")
                      : undefined,
                    endDate: dateRange?.to
                      ? format(dateRange.to, "yyyy-MM-dd")
                      : undefined,
                  })
                }
                disabled={!dateRange?.from || isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Exporting..." : "Export"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
