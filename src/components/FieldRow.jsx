import React from 'react'
import FieldIcon from './FieldIcon.jsx'

export default function FieldRow({ soccerFields }) {
  const full = Math.floor(soccerFields)
  const frac = soccerFields - full
  const cappedFull = Math.min(full, 5)
  const overflow = full - cappedFull
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-3">
      {Array.from({ length: cappedFull }).map((_, i) => (
        <FieldIcon key={i} uid={`f${i}`} fill={1} />
      ))}
      <FieldIcon uid="frac" fill={frac} />
      {overflow > 0 && <span className="font-body text-xs opacity-50 ml-1">+{overflow} more</span>}
    </div>
  )
}
