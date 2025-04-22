"use client"

import React from "react";
import {
  Line,
  LineChart,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";

export function ChartContainer({
  children,
  config = {},
  ...props
}) {
  return <div {...props}>{children}</div>;
}

export function ChartTooltip({ children, ...props }) {
  return (
    <div {...props} className="rounded-lg border bg-background p-2 shadow-sm">
      {children}
    </div>
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  ...props
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="grid gap-2" {...props}>
      {!hideLabel && (
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
        </div>
      )}
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
          <span className="font-bold">
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export {
  Line,
  LineChart,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
};