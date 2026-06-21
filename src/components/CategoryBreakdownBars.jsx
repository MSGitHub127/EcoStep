import React from 'react'

// Reusable horizontal segmented bars, used both for the baseline
// composition (Profile) and today's logged savings by category
// (Progress). Deliberately built with plain divs rather than a chart
// library — only 3–4 segments, and hand-styled bars stay visually
// consistent with the rest of the app's sage-family palette.
export default function CategoryBreakdownBars({ items, unit }) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const pct = Math.round((item.value / total) * 100)
        const Icon = item.Icon
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-body text-xs font-medium flex items-center gap-1.5">
                <Icon size={13} className="opacity-70" /> {item.label}
              </span>
              <span className="font-body text-xs opacity-55">
                {item.value.toFixed(1)} {unit} · {pct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-charcoal/5 dark:bg-offwhite/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: item.shade }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
