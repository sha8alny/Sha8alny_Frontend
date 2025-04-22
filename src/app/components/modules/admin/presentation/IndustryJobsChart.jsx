"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/app/components/ui/Chart"



export function IndustryJobsChart({data}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid 
          strokeDasharray="3 3" 
          horizontal={false} 
          stroke="var(--border)" 
        />
        <XAxis
          type="number"
          stroke="var(--muted-text-color)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <YAxis
          type="category"
          dataKey="industry"
          stroke="var(--muted-text-color)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div style={{
                  backgroundColor: 'var(--card)',
                  borderRadius: 'var(--radius)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  padding: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: 'var(--secondary)' }} 
                      />
                      <span style={{ 
                        fontSize: '0.7rem', 
                        textTransform: 'uppercase',
                        color: 'var(--muted-text-color)'
                      }}>
                        {label}
                      </span>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: 'var(--text)'
                      }}>
                        {payload[0].value.toLocaleString()} jobs
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
          dataKey="jobs" 
          fill="var(--secondary)" 
          radius={[0, 4, 4, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}