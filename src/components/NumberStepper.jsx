import React from 'react'

// Shared +/- numeric control. Used by the onboarding quiz's distance/
// occupants refine step and by the profile's daily-goal setting — both
// used to hand-roll their own pair of round +/- buttons with identical
// markup, which is consolidated here.
export default function NumberStepper({ value, onChange, min, max, step, unit, className = '' }) {
  return (
    <div className={['flex items-center justify-between', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="Decrease"
        className="w-9 h-9 rounded-full border border-charcoal/10 dark:border-offwhite/15 font-body text-lg focus-visible:ring-2 focus-visible:ring-sage outline-none"
      >
        −
      </button>
      <div className="text-center">
        <span className="font-display text-xl font-semibold">{value}</span>
        {unit && <span className="font-body text-xs opacity-55 ml-1">{unit}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        aria-label="Increase"
        className="w-9 h-9 rounded-full border border-charcoal/10 dark:border-offwhite/15 font-body text-lg focus-visible:ring-2 focus-visible:ring-sage outline-none"
      >
        +
      </button>
    </div>
  )
}
