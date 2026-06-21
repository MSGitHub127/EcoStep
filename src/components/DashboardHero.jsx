import React from 'react'
import ProgressRing from './ProgressRing.jsx'
import FieldRow from './FieldRow.jsx'

export default function DashboardHero({ effectiveTons, soccerFields, pointsToday, dailyGoal }) {
  const progress = Math.min(pointsToday / dailyGoal, 1)
  return (
    <div className="relative rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-5 shadow-soft overflow-hidden">
      <div className="absolute top-4 right-4 flex flex-col items-center">
        <div className="relative">
          <ProgressRing progress={progress} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-body text-xs font-bold">{pointsToday}</span>
          </div>
        </div>
        <span className="font-body text-[10px] mt-1 opacity-55">pts today</span>
      </div>

      <p className="font-body text-xs uppercase tracking-widest mb-2 opacity-55">Estimated footprint</p>
      <h2 className="font-display text-2xl font-medium leading-snug pr-16">
        Your footprint is matching{' '}
        <span className="text-sage font-semibold">{soccerFields.toFixed(1)} soccer fields</span> of forest.
      </h2>

      <FieldRow soccerFields={soccerFields} />

      <p className="font-body text-xs mt-4 opacity-55">
        ≈ {effectiveTons.toFixed(1)} t CO₂e / year at today&apos;s pace · 1 field ≈ a mature-forest patch absorbing
        ~7.1 t/yr
        <span className="block mt-0.5 opacity-70">Illustrative estimate, not a precise measurement.</span>
      </p>
    </div>
  )
}
