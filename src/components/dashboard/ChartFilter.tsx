import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { useState } from "react";

type Period = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

type ChartFilterProps = {
  onPeriodChange: (period: Period) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  selectedPeriod: Period;
};

const ChartFilter = ({
  onPeriodChange,
  onDateRangeChange,
  selectedPeriod,
}: ChartFilterProps) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const periods: { label: string; value: Period }[] = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  const handleApplyDateRange = () => {
    if (startDate && endDate && onDateRangeChange) {
      onDateRangeChange(startDate, endDate);
      setShowDateRange(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? "default" : "outline"}
            size="sm"
            onClick={() => onPeriodChange(period.value)}
          >
            {period.label}
          </Button>
        ))}
        <Button
          variant={showDateRange ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDateRange(!showDateRange)}
          className="gap-2"
        >
          <Calendar className="size-4" />
          Date Range
        </Button>
      </div>

      {showDateRange ? (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed p-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-32"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-32"
            />
          </div>
          <Button size="sm" onClick={handleApplyDateRange}>
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowDateRange(false);
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ChartFilter;
