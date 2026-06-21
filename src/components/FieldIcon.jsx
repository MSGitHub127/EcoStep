import React from 'react'

export default function FieldIcon({ fill, uid }) {
  const clipFill = Math.max(0, Math.min(1, fill))
  return (
    <svg width="34" height="24" viewBox="0 0 100 70" className="shrink-0 text-charcoal/35 dark:text-offwhite/35">
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect x="0" y="0" width={clipFill * 100} height="70" />
        </clipPath>
      </defs>
      <rect x="2" y="2" width="96" height="66" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="2" y="2" width="96" height="66" rx="8" className="fill-sage" opacity="0.85" />
        <line x1="50" y1="2" x2="50" y2="68" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="35" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
    </svg>
  )
}
