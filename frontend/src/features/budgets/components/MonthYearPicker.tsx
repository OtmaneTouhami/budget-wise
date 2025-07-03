import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthYearPickerProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

export const MonthYearPicker = ({
  currentDate,
  onDateChange,
}: MonthYearPickerProps) => {
  const handlePreviousMonth = () => {
    onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold w-36 text-center">
        {formattedDate}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
