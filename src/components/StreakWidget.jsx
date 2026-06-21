import React from 'react'
import { Flame } from 'lucide-react'

export default function StreakWidget({ streak, celebrate }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-sage/10 border border-sage/30 px-3 py-1.5 ${
        celebrate ? 'pulse-glow' : ''
      }`}
    >
      <Flame size={15} className="text-sage" />
      <span className="font-body text-xs font-semibold whitespace-nowrap">{streak} Day Active Saving Streak</span>
    </div>
  )
}
