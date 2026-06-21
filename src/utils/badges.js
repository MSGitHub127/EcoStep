import { Footprints, Flame, CalendarCheck, Star, Trophy, Zap, Sparkles, TreePine } from 'lucide-react'

// Each badge is evaluated against a flat "progress" object built from
// badgeProgress + a couple of derived fields (see useEcoStepStore).
export const BADGE_DEFS = [
  {
    id: 'first-step',
    label: 'First Step',
    desc: 'Log your first action.',
    Icon: Footprints,
    check: (p) => p.totalLogs >= 1,
  },
  {
    id: 'habit-forming',
    label: 'Habit Forming',
    desc: 'Hit a 3-day streak.',
    Icon: Flame,
    check: (p) => p.bestStreak >= 3,
  },
  {
    id: 'two-weeks',
    label: 'Two Weeks Strong',
    desc: 'Hit a 14-day streak.',
    Icon: CalendarCheck,
    check: (p) => p.bestStreak >= 14,
  },
  {
    id: 'century-club',
    label: 'Century Club',
    desc: 'Earn 100 lifetime points.',
    Icon: Star,
    check: (p) => p.lifetimePoints >= 100,
  },
  {
    id: 'high-roller',
    label: 'High Roller',
    desc: 'Earn 1,000 lifetime points.',
    Icon: Trophy,
    check: (p) => p.lifetimePoints >= 1000,
  },
  {
    id: 'quick-draw',
    label: 'Quick Draw',
    desc: 'Log 25 quick actions.',
    Icon: Zap,
    check: (p) => p.totalQuickTaps >= 25,
  },
  {
    id: 'custom-creator',
    label: 'Custom Creator',
    desc: 'Log a custom action.',
    Icon: Sparkles,
    check: (p) => p.totalCustomLogs >= 1,
  },
  {
    id: 'forest-friend',
    label: 'Forest Friend',
    desc: 'Get under 1 field for a day.',
    Icon: TreePine,
    check: (p) => p.minFields !== null && p.minFields <= 1,
  },
]
