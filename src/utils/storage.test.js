import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { todayStr, yesterdayStr, loadState, saveState, clearState } from './storage.js'

describe('todayStr', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the current date as YYYY-MM-DD', () => {
    vi.setSystemTime(new Date('2026-06-21T15:42:00Z'))
    expect(todayStr()).toBe('2026-06-21')
  })
})

describe('yesterdayStr', () => {
  it('subtracts one day from a plain date', () => {
    expect(yesterdayStr('2026-06-21')).toBe('2026-06-20')
  })

  it('rolls back across a month boundary', () => {
    expect(yesterdayStr('2026-03-01')).toBe('2026-02-28')
  })

  it('rolls back across a year boundary', () => {
    expect(yesterdayStr('2026-01-01')).toBe('2025-12-31')
  })
})

describe('saveState / loadState / clearState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns null when nothing has been saved', () => {
    expect(loadState()).toBeNull()
  })

  it('round-trips a well-formed state object through localStorage', () => {
    const state = {
      streak: 3,
      answers: { diet: 'vegan' },
      today: { date: '2026-06-21', tapCounts: {}, checked: {}, customLogs: [] },
      history: [],
    }
    saveState(state)
    expect(loadState()).toEqual(state)
  })

  it('returns null instead of throwing on corrupted JSON', () => {
    window.localStorage.setItem('ecostep:v2', '{ not valid json')
    expect(loadState()).toBeNull()
  })

  it('rejects persisted data that is not object-shaped at all', () => {
    window.localStorage.setItem('ecostep:v2', JSON.stringify('just a string'))
    expect(loadState()).toBeNull()
    window.localStorage.setItem('ecostep:v2', JSON.stringify([1, 2, 3]))
    expect(loadState()).toBeNull()
    window.localStorage.setItem('ecostep:v2', JSON.stringify(null))
    expect(loadState()).toBeNull()
  })

  it('rejects persisted data missing the fields the app depends on', () => {
    // no "today" at all
    window.localStorage.setItem('ecostep:v2', JSON.stringify({ streak: 5 }))
    expect(loadState()).toBeNull()

    // "today" present but missing/malformed required sub-fields
    window.localStorage.setItem(
      'ecostep:v2',
      JSON.stringify({ today: { tapCounts: {}, checked: {}, customLogs: 'not-an-array' } })
    )
    expect(loadState()).toBeNull()

    // tampered "history" (should be an array of archived days)
    window.localStorage.setItem(
      'ecostep:v2',
      JSON.stringify({
        today: { date: '2026-06-21', tapCounts: {}, checked: {}, customLogs: [] },
        history: 'not-an-array',
      })
    )
    expect(loadState()).toBeNull()
  })

  it('clearState removes the persisted value', () => {
    saveState({ today: { date: '2026-06-21', tapCounts: {}, checked: {}, customLogs: [] } })
    clearState()
    expect(loadState()).toBeNull()
  })

  it('saveState fails silently when localStorage throws (quota exceeded, private mode, etc.)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveState({ a: 1 })).not.toThrow()
    spy.mockRestore()
  })
})
