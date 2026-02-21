import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartFilter from "./ChartFilter";

type Period = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

const dailyVisitsData = [
  { date: "Feb 1", visits: 2342 },
  { date: "Feb 2", visits: 2810 },
  { date: "Feb 3", visits: 2000 },
  { date: "Feb 4", visits: 2181 },
  { date: "Feb 5", visits: 2500 },
  { date: "Feb 6", visits: 2100 },
  { date: "Feb 7", visits: 2200 },
  { date: "Feb 8", visits: 2290 },
  { date: "Feb 9", visits: 2000 },
  { date: "Feb 10", visits: 2181 },
  { date: "Feb 11", visits: 2500 },
  { date: "Feb 12", visits: 2100 },
  { date: "Feb 13", visits: 2800 },
  { date: "Feb 14", visits: 3100 },
  { date: "Feb 15", visits: 2342 },
  { date: "Feb 16", visits: 2810 },
  { date: "Feb 17", visits: 2000 },
  { date: "Feb 18", visits: 2181 },
  { date: "Feb 19", visits: 2500 },
  { date: "Feb 20", visits: 2100 },
  { date: "Feb 21", visits: 2800 },
  { date: "Feb 22", visits: 2600 },
];

const weeklyVisitsData = [
  { date: "Week 1", visits: 18241 },
  { date: "Week 2", visits: 21512 },
  { date: "Week 3", visits: 19842 },
  { date: "Week 4", visits: 22156 },
];

const monthlyVisitsData = [
  { date: "January", visits: 68421 },
  { date: "February", visits: 71923 },
];

const quarterlyVisitsData = [
  { date: "Q1 2026", visits: 198456 },
  { date: "Q4 2025", visits: 185234 },
];

const yearlyVisitsData = [
  { date: "2024", visits: 752341 },
  { date: "2025", visits: 821456 },
];

const CustomerVisitsChart = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const getChartData = () => {
    switch (period) {
      case "weekly":
        return weeklyVisitsData;
      case "monthly":
        return monthlyVisitsData;
      case "quarterly":
        return quarterlyVisitsData;
      case "yearly":
        return yearlyVisitsData;
      default:
        return dailyVisitsData;
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Visits</CardTitle>
        <CardDescription>
          Daily website traffic and customer visits over time
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
          <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            Showing data from {dateRange.start} to {dateRange.end}
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
              formatter={(value) => [value, "Visits"]}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVisits)"
              name="Visits"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CustomerVisitsChart;
