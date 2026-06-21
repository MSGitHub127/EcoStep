import { CATEGORY_META } from '../data/baseline.js'

// Rule-based "what matters most" suggestion — no AI call needed, just a
// transparent comparison of where someone's baseline footprint comes from,
// optionally aware of what they've already logged today.
export function getFocusInsight(breakdown, todayCategoryTotals) {
  const candidates = [
    { category: 'diet', tons: breakdown.diet, actionTip: 'Try logging a plant-based meal — food is your biggest lever right now.' },
    { category: 'transport', tons: breakdown.transport, actionTip: 'A bus/train trip or carpool would make the biggest dent today.' },
    { category: 'home', tons: breakdown.home, actionTip: 'Small home-energy habits (cold wash, early geyser off) matter most for you.' },
  ]
  candidates.sort((a, b) => b.tons - a.tons)
  const top = candidates[0]
  const alreadyActedToday = (todayCategoryTotals?.[top.category] || 0) > 0

  return {
    category: top.category,
    meta: CATEGORY_META[top.category],
    tip: alreadyActedToday
      ? `Nice — you've already logged a ${CATEGORY_META[top.category].label.toLowerCase()} win today, your biggest lever.`
      : top.actionTip,
    alreadyActedToday,
  }
}
