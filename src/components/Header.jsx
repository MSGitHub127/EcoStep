import React from 'react'
import { Sun, Moon, Sprout } from 'lucide-react'

export default function Header({ isDark, onToggleTheme }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-2xl bg-sage flex items-center justify-center">
          <Sprout size={16} className="text-offwhite" />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">EcoStep</span>
      </div>
      <button
        onClick={onToggleTheme}
        aria-label="Toggle light/dark mode"
        className="w-9 h-9 rounded-full flex items-center justify-center border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft transition-colors"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  )
}
