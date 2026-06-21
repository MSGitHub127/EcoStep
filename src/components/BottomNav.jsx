import React from 'react'
import { Home, LineChart, User } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'progress', label: 'Progress', Icon: LineChart },
  { id: 'profile', label: 'Profile', Icon: User },
]

export default function BottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-charcoal/10 dark:border-offwhite/15 bg-offwhite/95 dark:bg-charcoal/95 backdrop-blur">
      <div className="max-w-md mx-auto grid grid-cols-3">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2.5 font-body text-xs transition-colors ${
                isActive ? 'text-sage font-semibold' : 'text-charcoal/50 dark:text-offwhite/50'
              }`}
            >
              <tab.Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
