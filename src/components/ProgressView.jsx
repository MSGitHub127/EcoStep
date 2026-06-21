import React from 'react'
import WeeklyChart from './WeeklyChart.jsx'
import BadgesGrid from './BadgesGrid.jsx'
import CategoryBreakdownBars from './CategoryBreakdownBars.jsx'
import { CATEGORY_META } from '../data/baseline.js'

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-3 text-center">
      <p className="font-display text-lg font-semibold text-sage">{value}</p>
      <p className="font-body text-[10px] opacity-55 mt-0.5">{label}</p>
    </div>
  )
}

export default function ProgressView({ weeklyHistory, badges, badgeProgress, streak, todayCategoryTotals }) {
  const categoryItems = Object.entries(todayCategoryTotals)
    .map(([key, value]) => ({ label: CATEGORY_META[key].label, Icon: CATEGORY_META[key].Icon, shade: CATEGORY_META[key].shade, value }))
    .filter((item) => item.value > 0)

  return (
    <div className="space-y-6 anim-step">
      <div>
        <p className="font-body text-sm opacity-55">Your progress</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Stats & badges</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Lifetime pts" value={badgeProgress.lifetimePoints} />
        <StatTile label="Best streak" value={`${badgeProgress.bestStreak}d`} />
        <StatTile label="Current streak" value={`${streak}d`} />
      </div>

      <WeeklyChart weeklyHistory={weeklyHistory} />

      <div className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-4 shadow-soft">
        <h3 className="font-display text-base font-semibold mb-3">Where today's savings came from</h3>
        {categoryItems.length > 0 ? (
          <CategoryBreakdownBars items={categoryItems} unit="kg" />
        ) : (
          <p className="font-body text-sm opacity-55">
            Nothing logged yet today — head to Home and tap a quick action to see it show up here.
          </p>
        )}
      </div>

      <BadgesGrid badges={badges} />
    </div>
  )
}
