import React from 'react'
import { X } from 'lucide-react'
import { QUICK_TAPS, CATEGORY_META } from '../data/baseline.js'
import CustomLogForm from './CustomLogForm.jsx'

export default function QuickLogModal({ tapCounts, onTap, customLogs, onLogCustom, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-offwhite dark:bg-charcoal-soft p-5 anim-step">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">All quick actions</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-charcoal/10 dark:border-offwhite/15"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {QUICK_TAPS.map((tap) => {
            const count = tapCounts[tap.id] || 0
            return (
              <button
                key={tap.id}
                onClick={() => onTap(tap)}
                className="w-full flex items-center justify-between gap-3 rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal px-4 py-3 text-left active:scale-[0.98] transition-all"
              >
                <div>
                  <p className="font-body text-sm font-semibold">
                    {tap.emoji} {tap.label}
                  </p>
                  <p className="font-body text-xs text-sage font-medium mt-0.5">
                    -{tap.kg} kg CO₂e · +{tap.points} pts
                  </p>
                </div>
                {count > 0 && (
                  <span className="shrink-0 w-7 h-7 rounded-full bg-sage text-offwhite font-body text-xs font-bold flex items-center justify-center">
                    ×{count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {customLogs.length > 0 && (
          <div className="mt-4">
            <p className="font-body text-xs uppercase tracking-widest opacity-50 mb-2">Today&apos;s custom logs</p>
            <div className="flex flex-col gap-2">
              {customLogs.map((c) => {
                const meta = CATEGORY_META[c.category] || CATEGORY_META.waste
                const CatIcon = meta.Icon
                return (
                  <div key={c.ts} className="flex items-center justify-between rounded-xl bg-sage/10 px-3 py-2">
                    <span className="font-body text-sm flex items-center gap-2">
                      <CatIcon size={13} className="opacity-60" /> {c.label}
                    </span>
                    <span className="font-body text-xs text-sage font-medium">-{c.kg} kg</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-4">
          <CustomLogForm onSubmit={onLogCustom} />
        </div>
      </div>
    </div>
  )
}
