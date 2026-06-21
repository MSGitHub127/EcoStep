import React from 'react'

export default function InsightCard({ insight }) {
  const Icon = insight.meta.Icon
  return (
    <div className="anim-step rounded-2xl border border-sage/30 bg-sage/10 p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-sage/20 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-sage" />
      </div>
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-sage font-semibold mb-1">Your focus area</p>
        <p className="font-body text-sm leading-snug">{insight.tip}</p>
      </div>
    </div>
  )
}
