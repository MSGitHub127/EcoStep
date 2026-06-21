import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEcoStepStore } from './useEcoStepStore.js'
import { QUICK_TAPS, CHECKLIST_ITEMS } from '../data/baseline.js'

const PLANT_MEAL = QUICK_TAPS.find((t) => t.id === 'plant-meal') // kg 2, points 20
const [GEYSER, COLD_WASH, SHORT_TRIP] = CHECKLIST_ITEMS // 3 checklist items, by design

describe('useEcoStepStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts fresh: no onboarding, default goal, zero streak', () => {
    const { result } = renderHook(() => useEcoStepStore())
    expect(result.current.onboardingComplete).toBe(false)
    expect(result.current.stepIndex).toBe(0)
    expect(result.current.dailyGoal).toBe(100)
    expect(result.current.streak).toBe(0)
  })

  it('advances through the quiz and computes the baseline from the answers given', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useEcoStepStore())

    act(() => result.current.selectAnswer('diet', 'vegan'))
    expect(result.current.stepIndex).toBe(1)
    expect(result.current.onboardingComplete).toBe(false)

    act(() => result.current.selectAnswer('commute', { modeId: 'transit', km: 100 }))
    expect(result.current.stepIndex).toBe(2)

    act(() => result.current.selectAnswer('home', { typeId: 'apartment', occupants: 2 }))
    // last step: enters the "calculating" loading beat before completing
    expect(result.current.calculating).toBe(true)
    expect(result.current.onboardingComplete).toBe(false)

    act(() => vi.advanceTimersByTime(700))
    expect(result.current.calculating).toBe(false)
    expect(result.current.onboardingComplete).toBe(true)

    // diet 1.5 t/yr + transport (100km*52wk*0.1kg/km)/1000 + home 2.0/2 occupants = 3.0
    expect(result.current.baselineTons).toBeCloseTo(3.0, 5)
  })

  it('tapQuickAction increases today\'s points/kg, lifetime points, and shows a toast', () => {
    const { result } = renderHook(() => useEcoStepStore())

    act(() => result.current.tapQuickAction(PLANT_MEAL))

    expect(result.current.tapCounts['plant-meal']).toBe(1)
    expect(result.current.pointsToday).toBe(20)
    expect(result.current.badgeProgress.totalQuickTaps).toBe(1)
    expect(result.current.badgeProgress.lifetimePoints).toBe(20)
    expect(result.current.toast).toMatchObject({ points: 20 })
  })

  it('toggleChecklistItem awards points when checked and removes them when unchecked again', () => {
    const { result } = renderHook(() => useEcoStepStore())

    act(() => result.current.toggleChecklistItem(GEYSER))
    expect(result.current.checked[GEYSER.id]).toBe(true)
    expect(result.current.pointsToday).toBe(GEYSER.points)
    expect(result.current.badgeProgress.lifetimePoints).toBe(GEYSER.points)

    act(() => result.current.toggleChecklistItem(GEYSER))
    expect(result.current.checked[GEYSER.id]).toBe(false)
    expect(result.current.pointsToday).toBe(0)
    // lifetime points are NOT clawed back — only today's tally reverses
    expect(result.current.badgeProgress.lifetimePoints).toBe(GEYSER.points)
  })

  it('logCustomAction records the entry and derives points from kg', () => {
    const { result } = renderHook(() => useEcoStepStore())

    act(() => result.current.logCustomAction('Composted food scraps', 1.2, 'waste'))

    expect(result.current.customLogs).toHaveLength(1)
    expect(result.current.customLogs[0]).toMatchObject({ label: 'Composted food scraps', kg: 1.2, category: 'waste' })
    expect(result.current.badgeProgress.totalCustomLogs).toBe(1)
    // points = max(1, round(kg * 10))
    expect(result.current.customLogs[0].points).toBe(12)
  })

  it('logCustomAction rejects empty/whitespace labels, non-finite, non-positive, and oversized kg values', () => {
    const { result } = renderHook(() => useEcoStepStore())

    act(() => result.current.logCustomAction('', 5, 'waste'))
    act(() => result.current.logCustomAction('   ', 5, 'waste'))
    act(() => result.current.logCustomAction('ok', 0, 'waste'))
    act(() => result.current.logCustomAction('ok', -5, 'waste'))
    act(() => result.current.logCustomAction('ok', Infinity, 'waste'))
    act(() => result.current.logCustomAction('ok', NaN, 'waste'))
    act(() => result.current.logCustomAction('ok', 5000, 'waste')) // above the 1000kg ceiling

    expect(result.current.customLogs).toHaveLength(0)

    act(() => result.current.logCustomAction('Composted scraps', 5, 'waste'))
    expect(result.current.customLogs).toHaveLength(1)
  })

  it('logCustomAction falls back unknown categories to "waste" instead of trusting caller input', () => {
    const { result } = renderHook(() => useEcoStepStore())
    act(() => result.current.logCustomAction('Mystery action', 2, 'definitely-not-a-real-category'))
    expect(result.current.customLogs[0].category).toBe('waste')
  })

  it('logCustomAction trims, collapses whitespace, and caps label length at 60 characters', () => {
    const { result } = renderHook(() => useEcoStepStore())
    const longLabel = 'x'.repeat(200)
    act(() => result.current.logCustomAction(`  ${longLabel}   with   gaps  `, 1, 'waste'))
    expect(result.current.customLogs[0].label).toHaveLength(60)
  })

  it('setDailyGoal and toggleTheme update their respective fields', () => {
    const { result } = renderHook(() => useEcoStepStore())

    act(() => result.current.setDailyGoal(150))
    expect(result.current.dailyGoal).toBe(150)

    const wasDark = result.current.isDark
    act(() => result.current.toggleTheme())
    expect(result.current.isDark).toBe(!wasDark)
  })

  it('resetAll wipes state back to fresh defaults', () => {
    const { result } = renderHook(() => useEcoStepStore())
    act(() => result.current.tapQuickAction(PLANT_MEAL))
    expect(result.current.pointsToday).toBeGreaterThan(0)

    act(() => result.current.resetAll())

    expect(result.current.pointsToday).toBe(0)
    expect(result.current.onboardingComplete).toBe(false)
    expect(result.current.badgeProgress.lifetimePoints).toBe(0)
    // the persistence effect re-saves right after resetAll, so storage should
    // now reflect a fresh state rather than the wiped-but-unsaved gap
    const persisted = JSON.parse(window.localStorage.getItem('ecostep:v2'))
    expect(persisted.today.tapCounts).toEqual({})
  })

  it('builds a streak across calendar days and does not double-count same-day re-toggles', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-20T08:00:00'))

    const { result, unmount } = renderHook(() => useEcoStepStore())

    act(() => {
      result.current.toggleChecklistItem(GEYSER)
      result.current.toggleChecklistItem(COLD_WASH)
      result.current.toggleChecklistItem(SHORT_TRIP)
    })
    expect(result.current.streak).toBe(1)

    // Re-toggling an item off and back on the same day shouldn't re-trigger the streak bump.
    act(() => result.current.toggleChecklistItem(GEYSER))
    act(() => result.current.toggleChecklistItem(GEYSER))
    expect(result.current.streak).toBe(1)

    unmount()

    // Move to the next calendar day and remount — the store should roll the
    // previous "today" into history and pick the streak back up from storage.
    vi.setSystemTime(new Date('2026-06-21T08:00:00'))
    const { result: day2 } = renderHook(() => useEcoStepStore())

    expect(day2.current.streak).toBe(1) // not reset by rollover
    expect(day2.current.checked[GEYSER.id]).toBeFalsy() // fresh "today"

    act(() => {
      day2.current.toggleChecklistItem(GEYSER)
      day2.current.toggleChecklistItem(COLD_WASH)
      day2.current.toggleChecklistItem(SHORT_TRIP)
    })

    expect(day2.current.streak).toBe(2)
    expect(day2.current.badgeProgress.bestStreak).toBe(2)
  })
})
