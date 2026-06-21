import React from 'react'

export default function BadgeCard({ badge }) {
  const Icon = badge.Icon
  return (
    <div
      className={`rounded-2xl border p-3 flex flex-col items-center text-center gap-1.5 transition-all ${
        badge.unlocked ? 'border-sage bg-sage/10' : 'border-charcoal/10 dark:border-offwhite/15 opacity-50'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          badge.unlocked
            ? 'bg-sage text-offwhite'
            : 'bg-charcoal/5 dark:bg-offwhite/10 text-charcoal/40 dark:text-offwhite/40'
        }`}
      >
        <Icon size={18} />
      </div>
      <p className="font-body text-xs font-semibold leading-tight">{badge.label}</p>
      <p className="font-body text-[10px] opacity-60 leading-tight">{badge.desc}</p>
    </div>
  )
}
