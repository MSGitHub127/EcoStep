import { describe, it, expect } from 'vitest'
import { getFocusInsight } from './insights.js'

describe('getFocusInsight', () => {
  it('picks the category with the largest baseline footprint', () => {
    const result = getFocusInsight({ diet: 3, transport: 1, home: 0.5 }, {})
    expect(result.category).toBe('diet')
  })

  it('picks transport when it dominates the breakdown', () => {
    const result = getFocusInsight({ diet: 1, transport: 3, home: 0.5 }, {})
    expect(result.category).toBe('transport')
  })

  it('picks home when it dominates the breakdown', () => {
    const result = getFocusInsight({ diet: 1, transport: 0.5, home: 3 }, {})
    expect(result.category).toBe('home')
  })

  it('flags alreadyActedToday when the top category has logged activity today', () => {
    const result = getFocusInsight({ diet: 1, transport: 3, home: 0.5 }, { transport: 5 })
    expect(result.alreadyActedToday).toBe(true)
    expect(result.tip).toMatch(/already logged/i)
  })

  it('does not flag alreadyActedToday when the top category is untouched', () => {
    const result = getFocusInsight({ diet: 3, transport: 1, home: 0.5 }, { transport: 5 })
    expect(result.alreadyActedToday).toBe(false)
  })

  it('treats a missing todayCategoryTotals as "nothing logged yet" rather than throwing', () => {
    expect(() => getFocusInsight({ diet: 1, transport: 0.2, home: 0.1 }, undefined)).not.toThrow()
    const result = getFocusInsight({ diet: 1, transport: 0.2, home: 0.1 }, undefined)
    expect(result.alreadyActedToday).toBe(false)
  })

  it('returns the matching category metadata', () => {
    const result = getFocusInsight({ diet: 1, transport: 0.2, home: 0.1 }, {})
    expect(result.meta.label).toBe('Food')
  })
})
