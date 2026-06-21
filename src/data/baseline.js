import {
  Sprout,
  Salad,
  UtensilsCrossed,
  ChefHat,
  Bike,
  Bus,
  Car,
  Building2,
  Home,
  Flame,
  Droplet,
  ShoppingBag,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Onboarding quiz options.
//
// Values are simplified, illustrative factors inspired by widely published
// research rather than precise per-person measurements:
//  - Diet figures follow the general pattern of dietary-footprint studies
//    such as Poore & Nemecek (Science, 2018) and Our World in Data's food
//    emissions analysis.
//  - Transport figures are ballpark per-passenger-km averages, in the style
//    of UK DEFRA conversion factors (varies hugely by vehicle/route/grid).
//  - Home energy figures are rough household averages split across
//    occupants. Real homes vary a lot by climate, grid mix, and size.
// See METHODOLOGY_NOTE below for the full caveat shown in the app.
// ---------------------------------------------------------------------------

export const DIET_OPTIONS = [
  { id: 'vegan', label: 'Vegan / Plant-based', sub: 'Mostly or entirely plants', tonsPerYear: 1.5, Icon: Sprout },
  { id: 'vegetarian', label: 'Vegetarian', sub: 'No meat, dairy & eggs OK', tonsPerYear: 1.7, Icon: Salad },
  { id: 'flexitarian', label: 'Flexitarian', sub: 'Meat a few times a week', tonsPerYear: 2.5, Icon: UtensilsCrossed },
  { id: 'meatheavy', label: 'Meat-heavy', sub: 'Meat most days', tonsPerYear: 3.3, Icon: ChefHat },
]

// kgPerKm = kg CO2e per passenger-km. defaultKm = a sensible starting point
// for the weekly-distance stepper once a mode is picked.
export const COMMUTE_OPTIONS = [
  { id: 'active', label: 'Walk / Bike', sub: 'Mostly on foot or pedals', kgPerKm: 0, defaultKm: 40, Icon: Bike },
  { id: 'transit', label: 'Public Transit', sub: 'Bus, train, metro', kgPerKm: 0.1, defaultKm: 120, Icon: Bus },
  { id: 'vehicle', label: 'Personal Vehicle', sub: 'Drive most days', kgPerKm: 0.17, defaultKm: 250, Icon: Car },
]

// householdTons = total annual household energy footprint, split across
// occupants in the calculation (see useEcoStepStore.js).
export const HOME_OPTIONS = [
  { id: 'apartment', label: 'Apartment / Condo', sub: 'Shared building', householdTons: 2.0, Icon: Building2 },
  { id: 'house', label: 'Standalone House', sub: 'Detached home', householdTons: 3.6, Icon: Home },
]

export const STEPS = [
  { key: 'diet', title: 'What best describes your diet?', kind: 'choice', options: DIET_OPTIONS },
  {
    key: 'commute',
    title: 'How do you usually get around?',
    kind: 'distance',
    options: COMMUTE_OPTIONS,
    refineLabel: 'About how many km per week is that?',
    min: 0,
    max: 400,
    step: 10,
    unit: 'km/week',
  },
  {
    key: 'home',
    title: "What's your home type?",
    kind: 'occupants',
    options: HOME_OPTIONS,
    refineLabel: 'How many people share this home, including you?',
    min: 1,
    max: 6,
    step: 1,
    unit: 'people',
  },
]

// Illustrative analogy constant — NOT a precise scientific conversion.
// A regulation soccer field (~0.71 ha) of mature forest absorbing ~7.1 t CO2e/yr.
export const TONS_PER_SOCCER_FIELD = 7.14
export const DAILY_POINTS_GOAL = 100

// Sage-family tints/shades used to tell categories apart in breakdown bars
// without introducing colors outside the brand palette.
export const CATEGORY_META = {
  diet: { label: 'Food', Icon: Salad, shade: '#8F9E8B' },
  transport: { label: 'Transport', Icon: Bus, shade: '#6F7D6C' },
  home: { label: 'Home energy', Icon: Flame, shade: '#B5C2B2' },
  waste: { label: 'Waste & stuff', Icon: ShoppingBag, shade: '#5C6859' },
}

export const QUICK_TAPS = [
  { id: 'plant-meal', emoji: '🥗', label: 'Logged Plant-Meal', kg: 2, points: 20, category: 'diet' },
  { id: 'bus-train', emoji: '🚌', label: 'Took Bus/Train', kg: 5, points: 35, category: 'transport' },
  { id: 'unplugged', emoji: '🔌', label: 'Unplugged Idle Tech', kg: 0.5, points: 8, category: 'home' },
  { id: 'reusable-bag', emoji: '🛍️', label: 'Reusable Bag', kg: 1, points: 12, category: 'waste' },
  { id: 'water-bottle', emoji: '💧', label: 'Used Reusable Bottle', kg: 0.3, points: 6, category: 'waste' },
  { id: 'no-disposable-cup', emoji: '☕', label: 'Skipped Disposable Cup', kg: 0.3, points: 6, category: 'waste' },
  { id: 'air-dry', emoji: '🌬️', label: 'Air-Dried Laundry', kg: 1.5, points: 18, category: 'home' },
  { id: 'carpool', emoji: '🚗', label: 'Carpooled to Work', kg: 3, points: 28, category: 'transport' },
  { id: 'secondhand', emoji: '🏷️', label: 'Bought Secondhand', kg: 4, points: 30, category: 'waste' },
  { id: 'wfh', emoji: '🏠', label: 'Worked From Home', kg: 4, points: 32, category: 'transport' },
]

export const CHECKLIST_ITEMS = [
  { id: 'geyser', label: 'Turn off your geyser/water heater 10 mins early.', kg: 0.6, points: 15, Icon: Flame, category: 'home' },
  { id: 'cold-wash', label: 'Opt for a cold-water laundry cycle today.', kg: 0.3, points: 10, Icon: Droplet, category: 'home' },
  { id: 'short-trip', label: 'Walk or cycle for trips under 2 kilometers.', kg: 1.2, points: 20, Icon: Bike, category: 'transport' },
]

export const METHODOLOGY_NOTE =
  "These estimates use simplified, illustrative factors inspired by widely published research: dietary footprints follow patterns from studies like Poore & Nemecek (Science, 2018) and Our World in Data's food emissions analysis; transport factors are ballpark per-km averages in the style of UK DEFRA conversion factors; home energy figures are rough household averages split across occupants. Real footprints vary a lot by country, local grid mix, and individual habits — treat this as a starting point, not a precise measurement."
