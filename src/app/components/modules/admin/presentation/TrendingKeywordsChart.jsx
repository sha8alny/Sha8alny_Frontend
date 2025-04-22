"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/app/components/ui/Chart"


const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--secondary)",
]

export function TrendingKeywordsChart({data}) {
  return (
    <div className="flex flex-col h-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={80} 
            paddingAngle={5} 
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
          className = "ml-0"
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] py-2 pr-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: payload[0].color }} 
                        />
                        <span className="text-[0.7rem] uppercase text-[var(--muted-text-color)]">
                          {payload[0].payload.keyword}
                        </span>
                        <span className="font-bold text-[var(--text)]">
                          {payload[0].value.toLocaleString()} mentions
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="text-sm text-[var(--text)]">
              {item.keyword}
            </span>
            <span className="text-sm text-[var(--muted-text-color)] ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
