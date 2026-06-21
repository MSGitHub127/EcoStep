import React from 'react'

export default function PointsToast({ toast }) {
  if (!toast) return null
  const positive = toast.points >= 0
  return (
    <div
      key={toast.id}
      className={`float-up fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full font-body text-xs font-bold px-4 py-1.5 shadow-lg text-offwhite ${
        positive ? 'bg-sage' : 'bg-terracotta'
      }`}
    >
      {positive ? `+${toast.points} pts` : `${toast.points} pts`}
    </div>
  )
}
