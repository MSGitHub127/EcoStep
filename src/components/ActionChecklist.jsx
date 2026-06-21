import React from 'react'
import { Check } from 'lucide-react'
import { CHECKLIST_ITEMS } from '../data/baseline.js'

export default function ActionChecklist({ checked, onToggle }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold mb-3">Today&apos;s 3 micro-actions</h3>
      <div className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft divide-y divide-charcoal/10 dark:divide-offwhite/15 shadow-soft">
        {CHECKLIST_ITEMS.map((item, i) => {
          const isChecked = !!checked[item.id]
          const Icon = item.Icon
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item)}
              style={{ animationDelay: `${i * 60}ms` }}
              className="anim-step w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <span
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked ? 'bg-sage border-sage' : 'border-sage/30'
                }`}
              >
                {isChecked && <Check size={14} className="text-offwhite pop-in" />}
              </span>
              <Icon size={16} className="text-sage shrink-0" />
              <span className={`font-body text-sm flex-1 transition-all ${isChecked ? 'line-through opacity-40' : ''}`}>
                {item.label}
              </span>
              <span className={`font-body text-xs font-semibold ${isChecked ? 'text-sage' : 'opacity-55'}`}>
                +{item.points}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
