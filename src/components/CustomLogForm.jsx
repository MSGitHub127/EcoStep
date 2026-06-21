import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { CATEGORY_META } from '../data/baseline.js'
import { CUSTOM_LOG_LABEL_MAX, CUSTOM_LOG_KG_MAX } from '../utils/validation.js'

// Same keys CATEGORY_META defines, so adding/renaming a category there
// automatically updates this picker — no separate list to keep in sync.
const CATEGORY_IDS = Object.keys(CATEGORY_META)

export default function CustomLogForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [kg, setKg] = useState('')
  const [category, setCategory] = useState('waste')

  const submit = (e) => {
    e.preventDefault()
    const cleanLabel = label.trim().replace(/\s+/g, ' ').slice(0, CUSTOM_LOG_LABEL_MAX)
    const kgNum = parseFloat(kg)
    const validKg = Number.isFinite(kgNum) && kgNum > 0 && kgNum <= CUSTOM_LOG_KG_MAX
    if (!cleanLabel || !validKg) return
    onSubmit(cleanLabel, kgNum, category)
    setLabel('')
    setKg('')
    setCategory('waste')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-sage/40 text-sage font-body text-sm font-semibold py-3 focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite dark:focus-visible:ring-offset-charcoal outline-none"
      >
        <Plus size={15} /> Log a custom action
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-sage/40 bg-sage/5 p-3 flex flex-col gap-2">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="What did you do?"
        maxLength={CUSTOM_LOG_LABEL_MAX}
        className="rounded-xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal px-3 py-2 font-body text-sm outline-none focus:border-sage"
      />
      <input
        value={kg}
        onChange={(e) => setKg(e.target.value)}
        type="number"
        step="0.1"
        min="0.1"
        max={CUSTOM_LOG_KG_MAX}
        placeholder="kg CO₂e saved (estimate)"
        className="rounded-xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal px-3 py-2 font-body text-sm outline-none focus:border-sage"
      />
      <div className="flex gap-1.5">
        {CATEGORY_IDS.map((id) => {
          const meta = CATEGORY_META[id]
          const Icon = meta.Icon
          const active = category === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={`flex-1 flex items-center justify-center gap-1 rounded-xl border py-2 font-body text-xs transition-colors ${
                active
                  ? 'border-sage bg-sage/15 text-sage font-semibold'
                  : 'border-charcoal/10 dark:border-offwhite/15 opacity-60'
              }`}
            >
              <Icon size={12} /> {meta.label}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2 mt-1">
        <button type="submit" className="flex-1 rounded-xl bg-sage text-offwhite font-body text-sm font-semibold py-2">
          Log it
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-xl border border-charcoal/10 dark:border-offwhite/15 font-body text-sm font-semibold py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
