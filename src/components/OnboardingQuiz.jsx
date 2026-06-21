import React, { useState, useEffect } from 'react'
import { STEPS } from '../data/baseline.js'
import FieldIcon from './FieldIcon.jsx'
import NumberStepper from './NumberStepper.jsx'

// A small loading moment that reuses the app's signature soccer-field
// visual instead of a generic spinner — "crunching the numbers" reads as
// fields settling into place.
function CalculatingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block"
            style={{ animation: 'fieldPulse 1.1s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
          >
            <FieldIcon uid={`load-${i}`} fill={1} />
          </span>
        ))}
      </div>
      <p className="font-body text-sm opacity-60">Setting your starting line…</p>
    </div>
  )
}

export default function OnboardingQuiz({ stepIndex, calculating, onSelect }) {
  const step = STEPS[stepIndex]

  const [selectedId, setSelectedId] = useState(null)
  const [refineVal, setRefineVal] = useState(null)

  useEffect(() => {
    setSelectedId(null)
    setRefineVal(null)
  }, [stepIndex])

  if (calculating) {
    return (
      <div className="anim-step">
        <ProgressBar stepIndex={stepIndex} calculating={calculating} />
        <div className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-5 shadow-soft">
          <CalculatingLoader />
        </div>
      </div>
    )
  }

  const handleCardClick = (opt) => {
    if (step.kind === 'choice') {
      onSelect(step.key, opt.id)
      return
    }
    setSelectedId(opt.id)
    setRefineVal(step.kind === 'distance' ? opt.defaultKm : 2)
  }

  const handleContinue = () => {
    if (step.kind === 'distance') {
      onSelect(step.key, { modeId: selectedId, km: refineVal })
    } else if (step.kind === 'occupants') {
      onSelect(step.key, { typeId: selectedId, occupants: refineVal })
    }
  }

  return (
    <div className="anim-step">
      <ProgressBar stepIndex={stepIndex} calculating={calculating} />

      <div className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-5 shadow-soft">
        <div key={step.key} className="anim-step">
          <h2 className="font-display text-xl font-semibold mb-4 leading-snug tracking-tight">{step.title}</h2>
          <div className="flex flex-col gap-3">
            {step.options.map((opt, i) => {
              const Icon = opt.Icon
              const isSelected = selectedId === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => handleCardClick(opt)}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={`anim-step w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sage outline-none ${
                    isSelected
                      ? 'border-sage bg-sage/10'
                      : 'border-charcoal/10 dark:border-offwhite/15 hover:border-sage hover:bg-sage/10'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-sage/20 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-sage" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm">{opt.label}</p>
                    <p className="font-body text-xs opacity-55">{opt.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {step.kind !== 'choice' && selectedId && (
            <div className="anim-step mt-4 pt-4 border-t border-charcoal/10 dark:border-offwhite/15">
              <p className="font-body text-xs opacity-55">{step.refineLabel}</p>
              <NumberStepper
                className="mt-3"
                value={refineVal}
                onChange={setRefineVal}
                min={step.min}
                max={step.max}
                step={step.step}
                unit={step.unit}
              />
              <button
                onClick={handleContinue}
                className="w-full mt-4 rounded-xl bg-sage text-offwhite font-body text-sm font-semibold py-2.5 active:scale-[0.98] transition-all"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ stepIndex, calculating }) {
  const currentStepNum = calculating ? STEPS.length : stepIndex + 1
  const pct = (currentStepNum / STEPS.length) * 100
  return (
    <>
      <p className="font-body text-xs uppercase tracking-widest mb-2 opacity-55">
        Step {currentStepNum} of {STEPS.length}
      </p>
      <div className="w-full h-1.5 rounded-full bg-sage/10 overflow-hidden mb-6">
        <div className="h-full bg-sage rounded-full transition-[width] duration-400 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </>
  )
}
