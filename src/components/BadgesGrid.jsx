import React from 'react'
import BadgeCard from './BadgeCard.jsx'

export default function BadgesGrid({ badges }) {
  const unlockedCount = badges.filter((b) => b.unlocked).length
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base font-semibold">Badges</h3>
        <span className="font-body text-xs opacity-55">
          {unlockedCount}/{badges.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {badges.map((b, i) => (
          <div key={b.id} style={{ animationDelay: `${i * 50}ms` }} className="anim-step">
            <BadgeCard badge={b} />
          </div>
        ))}
      </div>
    </div>
  )
}
