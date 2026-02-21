import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartFilter from "./ChartFilter";

type Period = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

const dailyOrderData = [
  { date: "Feb 1", orders: 124 },
  { date: "Feb 2", orders: 145 },
  { date: "Feb 3", orders: 98 },
  { date: "Feb 4", orders: 167 },
  { date: "Feb 5", orders: 134 },
  { date: "Feb 6", orders: 189 },
  { date: "Feb 7", orders: 156 },
  { date: "Feb 8", orders: 178 },
  { date: "Feb 9", orders: 142 },
  { date: "Feb 10", orders: 195 },
  { date: "Feb 11", orders: 168 },
  { date: "Feb 12", orders: 182 },
  { date: "Feb 13", orders: 174 },
  { date: "Feb 14", orders: 201 },
  { date: "Feb 15", orders: 156 },
  { date: "Feb 16", orders: 189 },
  { date: "Feb 17", orders: 165 },
  { date: "Feb 18", orders: 198 },
  { date: "Feb 19", orders: 142 },
  { date: "Feb 20", orders: 176 },
  { date: "Feb 21", orders: 189 },
  { date: "Feb 22", orders: 164 },
];

const weeklyOrderData = [
  { date: "Week 1", orders: 987 },
  { date: "Week 2", orders: 1124 },
  { date: "Week 3", orders: 1098 },
  { date: "Week 4", orders: 1245 },
];

const monthlyOrderData = [
  { date: "January", orders: 4245 },
  { date: "February", orders: 4684 },
];

const quarterlyOrderData = [
  { date: "Q1 2026", orders: 12456 },
  { date: "Q4 2025", orders: 11234 },
];

const yearlyOrderData = [
  { date: "2024", orders: 48562 },
  { date: "2025", orders: 52341 },
];

const OrderVolumeChart = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const getChartData = () => {
    switch (period) {
      case "weekly":
        return weeklyOrderData;
      case "monthly":
        return monthlyOrderData;
      case "quarterly":
        return quarterlyOrderData;
      case "yearly":
        return yearlyOrderData;
      default:
        return dailyOrderData;
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Volume</CardTitle>
        <CardDescription>
          Daily order volume throughout the current month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartFilter
          selectedPeriod={period}
          onPeriodChange={(newPeriod) => {
            setPeriod(newPeriod);
            setDateRange(null);
          }}
          onDateRangeChange={(start, end) => {
            setDateRange({ start, end });
          }}
        />

        {dateRange ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            Showing data from {dateRange.start} to {dateRange.end}
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value) => [value, "Orders"]}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="orders"
              fill="hsl(var(--primary))"
              name="Orders"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OrderVolumeChart;
