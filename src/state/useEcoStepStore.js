import { useState, useEffect, useRef, useMemo } from 'react'
import {
  DIET_OPTIONS,
  COMMUTE_OPTIONS,
  HOME_OPTIONS,
  STEPS,
  QUICK_TAPS,
  CHECKLIST_ITEMS,
  CATEGORY_META,
  TONS_PER_SOCCER_FIELD,
} from '../data/baseline.js'
import { BADGE_DEFS } from '../utils/badges.js'
import { getFocusInsight } from '../utils/insights.js'
import { loadState, saveState, clearState, todayStr, yesterdayStr } from '../utils/storage.js'
import { CUSTOM_LOG_LABEL_MAX, CUSTOM_LOG_KG_MAX } from '../utils/validation.js'

// Derived from CATEGORY_META rather than re-listed by hand, so adding or
// renaming a category in baseline.js can't silently leave this guard (or
// categoryTotalsForDay below) out of sync with what the rest of the app
// considers valid.
const VALID_CATEGORIES = Object.keys(CATEGORY_META)

function freshToday() {
  return { date: todayStr(), tapCounts: {}, checked: {}, customLogs: [] }
}

function freshState() {
  return {
    isDark: false,
    onboardingComplete: false,
    answers: {}, // { diet: 'vegan', commute: {modeId, km}, home: {typeId, occupants} }
    dailyGoal: 100,
    streak: 0,
    lastCompletedDate: null,
    history: [], // [{ date, kg, points }] — archived, oldest first
    today: freshToday(),
    badgeProgress: {
      totalQuickTaps: 0,
      totalCustomLogs: 0,
      lifetimePoints: 0,
      bestStreak: 0,
      minFields: null,
    },
  }
}

// kgForDay and pointsForDay used to be two hand-written reducers that
// walked taps/checklist/custom-logs identically and only differed in
// which numeric field they summed. sumDayField collapses that into one
// pass-the-field-name helper so the three sources of truth (quick taps,
// checklist, custom logs) only need to be enumerated once per metric.
function sumDayField(day, field) {
  const fromTaps = QUICK_TAPS.reduce((sum, t) => sum + (day.tapCounts[t.id] || 0) * t[field], 0)
  const fromChecklist = CHECKLIST_ITEMS.reduce((sum, c) => sum + (day.checked[c.id] ? c[field] : 0), 0)
  const fromCustom = day.customLogs.reduce((sum, c) => sum + c[field], 0)
  return fromTaps + fromChecklist + fromCustom
}

const kgForDay = (day) => sumDayField(day, 'kg')
const pointsForDay = (day) => sumDayField(day, 'points')

function categoryTotalsForDay(day) {
  const totals = Object.fromEntries(VALID_CATEGORIES.map((category) => [category, 0]))
  QUICK_TAPS.forEach((t) => {
    totals[t.category] += (day.tapCounts[t.id] || 0) * t.kg
  })
  CHECKLIST_ITEMS.forEach((c) => {
    totals[c.category] += day.checked[c.id] ? c.kg : 0
  })
  day.customLogs.forEach((c) => {
    const key = totals[c.category] !== undefined ? c.category : 'waste'
    totals[key] += c.kg
  })
  return totals
}

// If the persisted "today" record is actually from a previous calendar
// day, archive it into history and start a clean today.
function rollover(saved) {
  const today = todayStr()
  if (saved.today.date === today) return saved
  const archived = { date: saved.today.date, kg: kgForDay(saved.today), points: pointsForDay(saved.today) }
  return {
    ...saved,
    history: [...saved.history, archived].slice(-30),
    today: freshToday(),
  }
}

export function useEcoStepStore() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    return saved ? rollover(saved) : freshState()
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const [stepIndex, setStepIndex] = useState(0)
  const [calculating, setCalculating] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [toast, setToast] = useState(null)
  const wasAllChecked = useRef(CHECKLIST_ITEMS.every((c) => state.today.checked[c.id]))

  // --- Baseline math, built from the richer quiz answers ------------------
  const breakdown = useMemo(() => {
    const diet = DIET_OPTIONS.find((o) => o.id === state.answers.diet)?.tonsPerYear || 0

    const commuteAns = state.answers.commute || {}
    const commuteMode = COMMUTE_OPTIONS.find((o) => o.id === commuteAns.modeId)
    const transport = commuteMode ? ((commuteAns.km || 0) * 52 * commuteMode.kgPerKm) / 1000 : 0

    const homeAns = state.answers.home || {}
    const homeType = HOME_OPTIONS.find((o) => o.id === homeAns.typeId)
    const home = homeType ? homeType.householdTons / Math.max(1, homeAns.occupants || 1) : 0

    return { diet, transport, home }
  }, [state.answers])

  const baselineTons = useMemo(
    () => Math.round((breakdown.diet + breakdown.transport + breakdown.home) * 10) / 10,
    [breakdown]
  )

  const totalKgToday = useMemo(() => kgForDay(state.today), [state.today])
  const pointsToday = useMemo(() => pointsForDay(state.today), [state.today])
  const todayCategoryTotals = useMemo(() => categoryTotalsForDay(state.today), [state.today])

  const projectedAnnualSavings = (totalKgToday * 365) / 1000
  const effectiveTons = Math.max(baselineTons - projectedAnnualSavings, 0.3)
  const soccerFields = effectiveTons / TONS_PER_SOCCER_FIELD

  const insight = useMemo(() => getFocusInsight(breakdown, todayCategoryTotals), [breakdown, todayCategoryTotals])

  // Track the lowest field-count ever reached, for the "Forest Friend" badge.
  useEffect(() => {
    if (!state.onboardingComplete) return
    setState((s) => {
      const prevMin = s.badgeProgress.minFields
      if (prevMin === null || soccerFields < prevMin) {
        return { ...s, badgeProgress: { ...s.badgeProgress, minFields: soccerFields } }
      }
      return s
    })
  }, [soccerFields, state.onboardingComplete])

  const fireToast = (points) => {
    const id = Date.now()
    setToast({ id, points })
    setTimeout(() => setToast((cur) => (cur && cur.id === id ? null : cur)), 1050)
  }

  // value shape depends on the step: string for diet, { modeId, km } for
  // commute, { typeId, occupants } for home.
  const selectAnswer = (stepKey, value) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [stepKey]: value } }))
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setCalculating(true)
      setTimeout(() => {
        setCalculating(false)
        setState((s) => ({ ...s, onboardingComplete: true }))
      }, 700)
    }
  }

  const resetQuiz = () => {
    setStepIndex(0)
    setState((s) => ({ ...s, onboardingComplete: false, answers: {} }))
  }

  const tapQuickAction = (tap) => {
    setState((s) => ({
      ...s,
      today: {
        ...s.today,
        tapCounts: { ...s.today.tapCounts, [tap.id]: (s.today.tapCounts[tap.id] || 0) + 1 },
      },
      badgeProgress: {
        ...s.badgeProgress,
        totalQuickTaps: s.badgeProgress.totalQuickTaps + 1,
        lifetimePoints: s.badgeProgress.lifetimePoints + tap.points,
      },
    }))
    fireToast(tap.points)
  }

  const toggleChecklistItem = (item) => {
    const wasChecked = !!state.today.checked[item.id]
    setState((s) => ({
      ...s,
      today: { ...s.today, checked: { ...s.today.checked, [item.id]: !wasChecked } },
      badgeProgress: wasChecked
        ? s.badgeProgress
        : { ...s.badgeProgress, lifetimePoints: s.badgeProgress.lifetimePoints + item.points },
    }))
    fireToast(wasChecked ? -item.points : item.points)
  }

  const logCustomAction = (label, kg, category) => {
    const cleanLabel = String(label ?? '').trim().replace(/\s+/g, ' ').slice(0, CUSTOM_LOG_LABEL_MAX)
    const kgNum = Number(kg)
    if (!cleanLabel || !Number.isFinite(kgNum) || kgNum <= 0 || kgNum > CUSTOM_LOG_KG_MAX) return
    const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'waste'
    const points = Math.max(1, Math.round(kgNum * 10))
    setState((s) => ({
      ...s,
      today: {
        ...s.today,
        customLogs: [...s.today.customLogs, { label: cleanLabel, kg: kgNum, points, category: safeCategory, ts: Date.now() }],
      },
      badgeProgress: {
        ...s.badgeProgress,
        totalCustomLogs: s.badgeProgress.totalCustomLogs + 1,
        lifetimePoints: s.badgeProgress.lifetimePoints + points,
      },
    }))
    fireToast(points)
  }

  const allChecked = CHECKLIST_ITEMS.every((c) => state.today.checked[c.id])
  useEffect(() => {
    if (allChecked && !wasAllChecked.current) {
      const today = state.today.date
      setState((s) => {
        if (s.lastCompletedDate === today) return s
        const newStreak = s.lastCompletedDate === yesterdayStr(today) ? s.streak + 1 : 1
        const bestStreak = Math.max(s.badgeProgress.bestStreak, newStreak)
        return {
          ...s,
          streak: newStreak,
          lastCompletedDate: today,
          badgeProgress: { ...s.badgeProgress, bestStreak },
        }
      })
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 1400)
    }
    wasAllChecked.current = allChecked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked])

  const setDailyGoal = (n) => setState((s) => ({ ...s, dailyGoal: n }))
  const toggleTheme = () => setState((s) => ({ ...s, isDark: !s.isDark }))

  const resetAll = () => {
    clearState()
    setState(freshState())
    setStepIndex(0)
  }

  const weeklyHistory = useMemo(() => {
    const past = state.history.slice(-6)
    return [...past, { date: state.today.date, kg: totalKgToday, points: pointsToday }]
  }, [state.history, state.today.date, totalKgToday, pointsToday])

  const badges = useMemo(() => {
    const progress = {
      ...state.badgeProgress,
      totalLogs: state.badgeProgress.totalQuickTaps + state.badgeProgress.totalCustomLogs,
      minFields: state.badgeProgress.minFields ?? soccerFields,
    }
    return BADGE_DEFS.map((def) => ({ ...def, unlocked: def.check(progress) }))
  }, [state.badgeProgress, soccerFields])

  return {
    isDark: state.isDark,
    toggleTheme,
    onboardingComplete: state.onboardingComplete,
    stepIndex,
    calculating,
    selectAnswer,
    resetQuiz,
    answers: state.answers,
    baselineTons,
    breakdown,
    insight,
    tapCounts: state.today.tapCounts,
    tapQuickAction,
    customLogs: state.today.customLogs,
    logCustomAction,
    checked: state.today.checked,
    toggleChecklistItem,
    streak: state.streak,
    celebrate,
    toast,
    pointsToday,
    effectiveTons,
    soccerFields,
    todayCategoryTotals,
    dailyGoal: state.dailyGoal,
    setDailyGoal,
    weeklyHistory,
    badges,
    badgeProgress: state.badgeProgress,
    resetAll,
  }
}
