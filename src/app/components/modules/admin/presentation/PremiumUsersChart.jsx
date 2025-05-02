"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "@/app/components/ui/Chart"
import { useEffect, useState } from "react"

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const data = [
    { name: "Premium", value: premiumUsers },
    { name: "Basic", value: totalUsers - premiumUsers },
  ]
  
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
  }))
  
  const isLabelVisible =  windowWidth >= 1346 || (windowWidth<=767 && windowWidth>=570) 
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
      <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={isLabelVisible}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={isLabelVisible ? 
            ({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%` 
            : false
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {!isLabelVisible && (
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value, entry, index) => {
            return `${value} (${dataWithPercentage[index].percentage}%)`
          }}
        />
        )}
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