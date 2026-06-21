import React, { useState } from 'react'
import { Sun, Moon, RotateCcw, Trash2, Info } from 'lucide-react'
import { DIET_OPTIONS, COMMUTE_OPTIONS, HOME_OPTIONS, METHODOLOGY_NOTE } from '../data/baseline.js'
import CategoryBreakdownBars from './CategoryBreakdownBars.jsx'
import NumberStepper from './NumberStepper.jsx'

const DAILY_GOAL_MIN = 20
const DAILY_GOAL_MAX = 500
const DAILY_GOAL_STEP = 10

function MethodologyNote() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-body text-xs text-charcoal/60 dark:text-offwhite/60 hover:text-sage transition-colors"
      >
        <Info size={12} /> How we estimate this
      </button>
      {open && <p className="anim-step font-body text-xs opacity-60 mt-2 leading-relaxed">{METHODOLOGY_NOTE}</p>}
    </div>
  )
}

export default function ProfileView({
  answers,
  baselineTons,
  breakdown,
  dailyGoal,
  setDailyGoal,
  isDark,
  onToggleTheme,
  onRetakeQuiz,
  onResetAll,
}) {
  const [confirmingReset, setConfirmingReset] = useState(false)

  const diet = DIET_OPTIONS.find((o) => o.id === answers.diet)
  const commuteMode = COMMUTE_OPTIONS.find((o) => o.id === answers.commute?.modeId)
  const homeType = HOME_OPTIONS.find((o) => o.id === answers.home?.typeId)

  const breakdownItems = [
    { label: 'Food', Icon: diet?.Icon || DIET_OPTIONS[0].Icon, shade: '#8F9E8B', value: breakdown.diet },
    { label: 'Transport', Icon: commuteMode?.Icon || COMMUTE_OPTIONS[0].Icon, shade: '#6F7D6C', value: breakdown.transport },
    { label: 'Home energy', Icon: homeType?.Icon || HOME_OPTIONS[0].Icon, shade: '#B5C2B2', value: breakdown.home },
  ]

  return (
    <div className="space-y-6 anim-step">
      <div>
        <p className="font-body text-sm opacity-55">Settings</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Your profile</h1>
      </div>

      <section className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-4 shadow-soft">
        <h3 className="font-body text-xs uppercase tracking-widest opacity-55 mb-3">Your baseline</h3>

        <div className="space-y-2.5 mb-4">
          {diet && (
            <AnswerRow Icon={diet.Icon} label={diet.label} />
          )}
          {commuteMode && (
            <AnswerRow Icon={commuteMode.Icon} label={`${commuteMode.label} · ${answers.commute.km} km/week`} />
          )}
          {homeType && (
            <AnswerRow
              Icon={homeType.Icon}
              label={`${homeType.label} · ${answers.home.occupants} ${answers.home.occupants === 1 ? 'person' : 'people'}`}
            />
          )}
        </div>

        <p className="font-body text-xs opacity-55 mb-2">≈ {baselineTons.toFixed(1)} t CO₂e / year baseline, broken down:</p>
        <CategoryBreakdownBars items={breakdownItems} unit="t/yr" />
        <MethodologyNote />

        <button
          onClick={onRetakeQuiz}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-sage/40 text-sage font-body text-sm font-semibold py-2.5 hover:bg-sage/10 transition-colors focus-visible:ring-2 focus-visible:ring-sage outline-none"
        >
          <RotateCcw size={14} /> Retake the quiz
        </button>
      </section>

      <section className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-4 shadow-soft">
        <h3 className="font-body text-xs uppercase tracking-widest opacity-55 mb-3">Daily points goal</h3>
        <NumberStepper
          value={dailyGoal}
          onChange={setDailyGoal}
          min={DAILY_GOAL_MIN}
          max={DAILY_GOAL_MAX}
          step={DAILY_GOAL_STEP}
        />
      </section>

      <section className="rounded-2xl border border-charcoal/10 dark:border-offwhite/15 bg-white dark:bg-charcoal-soft p-4 shadow-soft flex items-center justify-between">
        <h3 className="font-body text-sm font-semibold">Appearance</h3>
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-charcoal/10 dark:border-offwhite/15 focus-visible:ring-2 focus-visible:ring-sage outline-none"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </section>

      <section className="rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4">
        <h3 className="font-body text-sm font-semibold mb-1">Reset all data</h3>
        <p className="font-body text-xs opacity-70 mb-3">
          Clears your baseline, history, streaks, and badges. This can&apos;t be undone.
        </p>
        {confirmingReset ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onResetAll()
                setConfirmingReset(false)
              }}
              className="flex-1 rounded-xl bg-terracotta text-offwhite font-body text-sm font-semibold py-2"
            >
              Yes, reset
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              className="flex-1 rounded-xl border border-charcoal/10 dark:border-offwhite/15 font-body text-sm font-semibold py-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingReset(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-terracotta text-terracotta font-body text-sm font-semibold py-2.5 focus-visible:ring-2 focus-visible:ring-terracotta outline-none"
          >
            <Trash2 size={14} /> Reset all data
          </button>
        )}
      </section>

      <p className="font-body text-xs opacity-40 text-center pt-2">
        EcoStep · estimates are illustrative, not precise measurements.
      </p>
    </div>
  )
}

function AnswerRow({ Icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-sage" />
      </div>
      <span className="font-body text-sm">{label}</span>
    </div>
  )
}
