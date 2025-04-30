"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/app/components/ui/Chart"




const COLORS = [
 
  "#fd9a00",
  "var(--secondary)",
]
/**
 * @namespace admin
 * @module admin
 */
/**
 * PremiumUsersChart component, displays a pie chart showing the distribution of premium vs basic users
 * @param {Object} props - Component props
 * @param {number} props.premiumUsers - Number of premium users
 * @param {number} props.totalUsers - Total number of users
 */
 function PremiumUsersChart({premiumUsers,totalUsers}) {
  const data = [
    { name: "Premium", value: premiumUsers },
    { name: "Basic", value: totalUsers - premiumUsers },
  ]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: payload[0].color }}
                      />
                      <span className="text-xs uppercase text-muted-foreground">
                        {payload[0].name}
                      </span>
                      <span className="font-bold">{payload[0].value.toLocaleString()} users</span>
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
  )
}
export default PremiumUsersChart