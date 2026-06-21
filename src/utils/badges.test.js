import { describe, it, expect } from 'vitest'
import { BADGE_DEFS } from './badges.js'

const baseProgress = {
  totalLogs: 0,
  bestStreak: 0,
  lifetimePoints: 0,
  totalQuickTaps: 0,
  totalCustomLogs: 0,
  minFields: null,
}

function unlockedIds(overrides) {
  const progress = { ...baseProgress, ...overrides }
  return BADGE_DEFS.filter((b) => b.check(progress)).map((b) => b.id)
}

describe('BADGE_DEFS', () => {
  it('has a unique id for every badge', () => {
    const ids = BADGE_DEFS.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('unlocks nothing for a brand-new user', () => {
    expect(unlockedIds({})).toEqual([])
  })

  it('unlocks "first-step" after one logged action', () => {
    expect(unlockedIds({ totalLogs: 1 })).toContain('first-step')
  })

  it('unlocks streak badges at their thresholds, and stacks lower ones', () => {
    expect(unlockedIds({ bestStreak: 3 })).toEqual(['habit-forming'])
    expect(unlockedIds({ bestStreak: 14 })).toEqual(
      expect.arrayContaining(['habit-forming', 'two-weeks'])
    )
  })

  it('does not unlock a streak badge one day short of its threshold', () => {
    expect(unlockedIds({ bestStreak: 2 })).not.toContain('habit-forming')
    expect(unlockedIds({ bestStreak: 13 })).not.toContain('two-weeks')
  })

  it('unlocks points badges at their thresholds, and stacks lower ones', () => {
    expect(unlockedIds({ lifetimePoints: 100 })).toContain('century-club')
    expect(unlockedIds({ lifetimePoints: 1000 })).toEqual(
      expect.arrayContaining(['century-club', 'high-roller'])
    )
  })

  it('unlocks "quick-draw" at 25 quick taps', () => {
    expect(unlockedIds({ totalQuickTaps: 24 })).not.toContain('quick-draw')
    expect(unlockedIds({ totalQuickTaps: 25 })).toContain('quick-draw')
  })

  it('unlocks "custom-creator" after one custom log', () => {
    expect(unlockedIds({ totalCustomLogs: 1 })).toContain('custom-creator')
  })

  it('"forest-friend" requires a real (non-null) measurement at or under 1 field', () => {
    expect(unlockedIds({ minFields: null })).not.toContain('forest-friend')
    expect(unlockedIds({ minFields: 1 })).toContain('forest-friend')
    expect(unlockedIds({ minFields: 0.4 })).toContain('forest-friend')
    expect(unlockedIds({ minFields: 1.01 })).not.toContain('forest-friend')
  })
})
