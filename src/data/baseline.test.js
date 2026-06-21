import { describe, it, expect } from 'vitest'
import {
  DIET_OPTIONS,
  COMMUTE_OPTIONS,
  HOME_OPTIONS,
  STEPS,
  QUICK_TAPS,
  CHECKLIST_ITEMS,
  CATEGORY_META,
  TONS_PER_SOCCER_FIELD,
} from './baseline.js'

const KNOWN_CATEGORIES = Object.keys(CATEGORY_META)

function expectUniqueIds(list, name) {
  const ids = list.map((x) => x.id)
  expect(new Set(ids).size, `${name} has duplicate ids: ${ids}`).toBe(ids.length)
}

describe('baseline config', () => {
  it('has unique ids within each option list', () => {
    expectUniqueIds(DIET_OPTIONS, 'DIET_OPTIONS')
    expectUniqueIds(COMMUTE_OPTIONS, 'COMMUTE_OPTIONS')
    expectUniqueIds(HOME_OPTIONS, 'HOME_OPTIONS')
    expectUniqueIds(QUICK_TAPS, 'QUICK_TAPS')
    expectUniqueIds(CHECKLIST_ITEMS, 'CHECKLIST_ITEMS')
  })

  it('gives every diet option a positive annual footprint', () => {
    DIET_OPTIONS.forEach((o) => expect(o.tonsPerYear).toBeGreaterThan(0))
  })

  it('gives every commute option a non-negative per-km factor', () => {
    COMMUTE_OPTIONS.forEach((o) => expect(o.kgPerKm).toBeGreaterThanOrEqual(0))
  })

  it('keeps STEPS aligned with the option lists they reference', () => {
    expect(STEPS.find((s) => s.key === 'diet').options).toBe(DIET_OPTIONS)
    expect(STEPS.find((s) => s.key === 'commute').options).toBe(COMMUTE_OPTIONS)
    expect(STEPS.find((s) => s.key === 'home').options).toBe(HOME_OPTIONS)
  })

  it('gives every distance/occupants step a sane, non-inverted range', () => {
    STEPS.filter((s) => s.kind !== 'choice').forEach((s) => {
      expect(s.min).toBeLessThan(s.max)
      expect(s.step).toBeGreaterThan(0)
    })
  })

  it('only assigns known categories to quick taps and checklist items', () => {
    QUICK_TAPS.forEach((t) => expect(KNOWN_CATEGORIES).toContain(t.category))
    CHECKLIST_ITEMS.forEach((c) => expect(KNOWN_CATEGORIES).toContain(c.category))
  })

  it('gives every quick tap and checklist item positive kg and points', () => {
    ;[...QUICK_TAPS, ...CHECKLIST_ITEMS].forEach((item) => {
      expect(item.kg).toBeGreaterThan(0)
      expect(item.points).toBeGreaterThan(0)
    })
  })

  it('uses a positive soccer-field conversion constant', () => {
    expect(TONS_PER_SOCCER_FIELD).toBeGreaterThan(0)
  })
})
