import React, { useState } from 'react'
import { QUICK_TAPS } from '../data/baseline.js'
import QuickLogModal from './QuickLogModal.jsx'

export default function QuickTapPanel({ tapCounts, onTap, customLogs, onLogCustom }) {
  const [pulseId, setPulseId] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const handleTap = (tap) => {
    onTap(tap)
    setPulseId(tap.id)
    setTimeout(() => setPulseId((cur) => (cur === tap.id ? null : cur)), 500)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base font-semibold">Quick log</h3>
        <button
          onClick={() => setShowAll(true)}
          className="font-body text-xs text-sage font-semibold hover:underline underline-offset-2"
        >
          See all →
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
          {QUICK_TAPS.map((tap, i) => {
            const count = tapCounts[tap.id] || 0
            return (
              <button
                key={tap.id}
                onClick={() => handleTap(tap)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`anim-step relative flex flex-col items-start gap-1 rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft px-4 py-3 min-w-[148px] text-left shrink-0 transition-all active:scale-[0.96] hover:-translate-y-0.5 hover:shadow-soft ${
                  pulseId === tap.id ? 'pulse-glow border-sage' : ''
                }`}
              >
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-sage text-offwhite font-body text-[10px] font-bold flex items-center justify-center pop-in">
                    ×{count}
                  </span>
                )}
                <span className="font-body text-sm font-semibold">
                  {tap.emoji} {tap.label}
                </span>
                <span className="font-body text-xs text-sage font-medium">-{tap.kg} kg CO₂e</span>
              </button>
            )
          })}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-offwhite dark:from-charcoal to-transparent" />
      </div>

      {showAll && (
        <QuickLogModal
          tapCounts={tapCounts}
          onTap={handleTap}
          customLogs={customLogs}
          onLogCustom={onLogCustom}
          onClose={() => setShowAll(false)}
        />
      )}
    </div>
  )
}
