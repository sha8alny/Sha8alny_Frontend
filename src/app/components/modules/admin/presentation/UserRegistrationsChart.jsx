"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/app/components/ui/Chart";

function UserRegistrationsChart({ data }) {
  console.log("UserRegistrations", data);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="week"
          stroke="var(--muted-text-color)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted-text-color)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  className="rounded-lg border bg-background p-2 shadow-sm"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span
                        className="text-[0.70rem] uppercase"
                        style={{ color: "var(--muted-text-color)" }}
                      >
                        Week
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--muted-text-color)" }}
                      >
                        {payload[0].payload.week}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-[0.70rem] uppercase"
                        style={{ color: "var(--muted-text-color)" }}
                      >
                        New Users
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        {payload[0].value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="var(--primary)"
          fillOpacity={1}
          fill="url(#colorUsers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
export default UserRegistrationsChart;
