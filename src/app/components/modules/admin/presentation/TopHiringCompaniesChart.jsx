"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/app/components/ui/Chart"

/**
 * @namespace admin
 * @module admin
 */
/**
 * TopHiringCompaniesChart component, displays a bar chart showing companies with the most job postings
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of objects containing company data with 'company' and 'jobsPosted' properties
 */
 function TopHiringCompaniesChart({data}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid 
          strokeDasharray="3 3" 
          horizontal={false} 
          className="stroke-border" 
        />
        <XAxis 
          type="number" 
          className="stroke-muted-text text-xs" 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          type="category"
          dataKey="company"
          className="stroke-muted-text text-xs"
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card rounded-2xl border border-border p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase text-">
                        Company
                      </span>
                      <span className="font-bold text-muted-text">
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase text-muted-text">
                        Jobs Posted
                      </span>
                      <span className="font-bold text-text">
                        {payload[0].value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar 
          dataKey="jobsPosted" 
          className="fill-secondary" 
          radius={[0, 4, 4, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TopHiringCompaniesChart