# EcoStep — Phase 1 MVP + Upgrades

A carbon-tracking app: a research-grounded onboarding quiz, a dashboard that
translates your footprint into a soccer-fields-of-forest analogy, a
rule-based "focus area" insight, a quick-tap action logger with custom
entries, a daily 3-item micro-action checklist, a weekly stats view with
category breakdowns and a badge system, and a profile/settings screen.

Built with **React + Vite + Tailwind CSS**, **lucide-react** icons, and
**recharts** for the weekly chart (lazy-loaded so it doesn't bloat the
initial bundle).

## What's new in this version

- **Research-grounded baseline math.** The quiz now computes your baseline
  from real per-unit factors instead of 18 fixed lookup values:
  - **Diet** (4 tiers, illustrative figures patterned after dietary-footprint
    research like Poore & Nemecek 2018 / Our World in Data).
  - **Commute** — pick a mode, then a stepper for weekly distance; the app
    multiplies km × a per-km factor (DEFRA-style ballpark averages).
  - **Home** — pick a type, then a stepper for household size; a household
    energy estimate gets divided across occupants.
  - A "How we estimate this" expandable note in Profile spells out the
    sources and caveats in plain language.
- **Smarter insights.** A "Your focus area" card on Home tells you which
  category (food / transport / home energy) is your biggest lever, computed
  by comparing your baseline breakdown — and it changes its tone once
  you've actually logged something in that category today.
- **Breakdown charts.** Profile shows your baseline split by category
  (diet/transport/home) as segmented bars; Progress shows where *today's*
  logged savings came from, by category.
- **Premium polish pass:**
  - Custom soft-shadow tokens for card depth instead of flat borders.
  - Staggered reveal animations on lists (quick-log pills, checklist rows,
    badge grid) instead of everything popping in at once.
  - `prefers-reduced-motion` respected — decorative animation is disabled
    for people who've asked their OS for that.
  - Visible focus rings on every interactive element (keyboard navigation
    actually works, not just mouse/touch).
  - The onboarding "crunching the numbers" loading state now uses the
    app's own soccer-field icon instead of a generic spinner.
  - A signature-themed favicon + `theme-color` meta tag.

## Project structure

```
src/
  data/baseline.js              quiz options, emission factors, quick-tap actions, checklist items
  data/baseline.test.js         data-integrity checks on the config above
  utils/storage.js               localStorage load/save + date helpers (+ shape validation)
  utils/storage.test.js
  utils/badges.js                badge definitions + unlock criteria
  utils/badges.test.js
  utils/insights.js              rule-based "focus area" suggestion logic
  utils/insights.test.js
  state/useEcoStepStore.js       the single hook holding all app state/logic
  state/useEcoStepStore.test.js  onboarding flow, points/streak accounting, input validation
  test/setup.js                  vitest + jest-dom + RTL setup
  components/
    Header.jsx
    OnboardingQuiz.jsx                  quiz incl. stepper refinement controls
    StreakWidget.jsx
    DashboardHero.jsx
    InsightCard.jsx                     "your focus area" callout
    FieldRow.jsx / FieldIcon.jsx        soccer-field visual (also used in the quiz loader)
    ProgressRing.jsx (+ .test.jsx)
    QuickTapPanel.jsx / QuickLogModal.jsx / CustomLogForm.jsx (+ .test.jsx)
    ActionChecklist.jsx (+ .test.jsx)
    PointsToast.jsx
    BottomNav.jsx
    ProgressView.jsx / WeeklyChart.jsx / BadgesGrid.jsx / BadgeCard.jsx
    CategoryBreakdownBars.jsx           reusable breakdown bars (Profile + Progress)
    ProfileView.jsx
  App.jsx                         wires everything together + tab routing
  main.jsx                        React entry point
  index.css                       Tailwind + custom keyframes + reduced-motion/focus rules
tailwind.config.js                brand colors, fonts, custom shadow token, dark-mode strategy
public/_headers                   Netlify-style HTTP security headers
vercel.json                       same headers, Vercel's config format
```

## Testing

```bash
npm install
npm test          # run the suite once
npm run test:watch
npm run coverage   # text + HTML coverage report in coverage/
```

The suite uses **Vitest** + **@testing-library/react** + **jsdom**, and covers:
- Pure logic: emission-factor math, badge unlock thresholds, the "focus
  area" recommendation rule, date/storage helpers, and a data-integrity
  check on `baseline.js` itself (unique ids, positive factors, sane ranges).
- The `useEcoStepStore` hook: the full onboarding flow, point/kg accounting
  for taps/checklist/custom logs, the input-validation guard on
  `logCustomAction`, daily-goal/theme toggles, `resetAll`, and — the
  trickiest bit of state in the app — that streaks correctly persist and
  increment across a simulated calendar-day rollover, without
  double-counting same-day re-toggles.
- A few representative components (`CustomLogForm`, `ActionChecklist`,
  `ProgressRing`) at the DOM level: open/close behavior, rejecting invalid
  input, and the SVG math behind the progress ring.

This isn't full coverage of every component (most are thin, mostly-styling
JSX with little branching logic), but the state machine and validation
logic — where actual bugs would hide — are exercised directly.

## Linting & formatting

```bash
npm run lint           # ESLint: React/hooks correctness rules
npm run format          # Prettier: write formatting fixes
npm run format:check    # Prettier: check only, no writes (CI-friendly)
```

ESLint is configured (`eslint.config.js`) with `eslint-plugin-react` and
`eslint-plugin-react-hooks`, so things like missing `useEffect` dependencies
or a `.map()` without a `key` are caught as warnings/errors at lint time
instead of being found later by hand. Prettier (`.prettierrc.json`) matches
the style already used throughout the codebase — no semicolons, single
quotes — so it should produce a near-empty diff on first run.

## Security

This is a fully client-side app: no backend, no auth, no third-party API
calls, persistence only to `localStorage` on the user's own device. The
hardening here is scoped accordingly:

- **Content-Security-Policy** (`index.html`) restricts scripts to same-origin,
  fonts to Google Fonts, and blocks everything else by default
  (`object-src 'none'`, `frame-ancestors 'none'`, no inline scripts). The dev
  server automatically relaxes `script-src` for Vite's Fast Refresh preamble
  (see `vite.config.js`) without touching the stricter policy that actually
  ships in the production build.
- **HTTP-only headers** that a `<meta>` CSP can't express
  (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`,
  `Permissions-Policy`) are in `public/_headers` (Netlify) and `vercel.json`
  (Vercel) — wire up the equivalent on whatever host you actually deploy to.
- **Input validation lives at the state layer, not just the form.**
  `logCustomAction` in `useEcoStepStore.js` trims/collapses/length-caps the
  label, rejects non-finite or out-of-range kg values (including the
  `Infinity`/`NaN` bypass a bare `kg <= 0` check misses), and falls back
  unknown categories to a safe default — so any future caller, not just the
  one current form, is protected.
- **Persisted data is never trusted blindly.** `loadState()` in `storage.js`
  does a structural shape check before spreading localStorage contents into
  live app state, so corrupted, hand-edited, or otherwise malformed data
  fails closed (falls back to a fresh state) instead of crashing the app or
  propagating bad data forward.

If you add a backend, auth, or any outbound `fetch`/API calls later,
`connect-src 'self'` in the CSP will need to be extended to allow that.



## Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

This outputs a static site into `dist/`. Sanity-check it locally with:

```bash
npm run preview
```

## Publishing it

Any static host works since this is a plain Vite build.

### Option A — Netlify (drag and drop)
1. Run `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dist/` folder in.

### Option B — Vercel
1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo. Defaults work.

### Option C — GitHub Pages
1. `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
3. In `vite.config.js`, set `base: '/<your-repo-name>/'`.
4. `npm run build && npm run deploy`

## A note on this round's changes — data migration

The quiz answer shape changed (commute/home went from a single id to an
object with a quantity), so the localStorage key was bumped from
`ecostep:v1` to `ecostep:v2`. Anyone who used the previous version will
just start fresh — there's no migration path, since the underlying baseline
calculation itself changed.

## Things to change before treating this as real

- **Factors are still illustrative, not exact.** The per-unit numbers in
  `src/data/baseline.js` follow the *pattern* of published research but
  aren't pulled from a live, region-specific emissions database. A real
  product should let users pick their country/region and use actual grid
  carbon intensity (this was flagged as a refinement opportunity in the
  original research brief) and actual transport-mode factors.
- **No real backend.** Data lives in `localStorage` on one device/browser.
- **Day-rollover is "last session" based**, not gap-filling.
- **`todayStr()` uses UTC dates**, so the "day" boundary may not line up
  exactly with a user's local midnight.
- **I couldn't visually render this build in this environment** (no headless
  browser available here) — the build compiles cleanly and the logic is
  unit-reasoned through carefully, but give the onboarding stepper screens
  and the new breakdown bars a quick visual pass once you run it, in case
  any spacing wants a small tweak on your actual device.
