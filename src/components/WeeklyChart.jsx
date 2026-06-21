import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function dayLabel(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

export default function WeeklyChart({ weeklyHistory }) {
  const data = weeklyHistory.map((h) => ({ day: dayLabel(h.date), kg: Math.round(h.kg * 10) / 10 }))

  return (
    <div className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-4 text-charcoal dark:text-offwhite">
      <h3 className="font-display text-base font-semibold mb-3">This week's savings</h3>
      <div style={{ width: '100%', height: 160 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(143,158,139,0.15)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'currentColor' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12, fontFamily: 'Manrope' }}
              formatter={(value) => [`${value} kg CO₂e`, 'Saved']}
            />
            <Bar dataKey="kg" radius={[6, 6, 0, 0]} fill="#8F9E8B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
