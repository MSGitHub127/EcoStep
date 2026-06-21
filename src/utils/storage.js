// v2: bumped when the answer shape changed (commute/home became objects
// instead of plain option ids) to avoid crashing on stale v1 data.
const STORAGE_KEY = 'ecostep:v2'

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function yesterdayStr(dateStr) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

// Cheap structural check on persisted data before we trust it enough to
// spread into live state. localStorage is plain text on the user's
// machine — it can be hand-edited, corrupted by a full disk, or written
// to by another script with page access. We don't try to validate every
// field (that's what rollover/freshState defaults are for), just confirm
// the shape is "object-like enough" not to throw when the rest of the
// app reads s.today.checked[id], s.history.length, etc.
function isPlausibleState(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false
  if (!obj.today || typeof obj.today !== 'object') return false
  if (typeof obj.today.date !== 'string') return false
  if (!Array.isArray(obj.today.customLogs)) return false
  if (obj.history !== undefined && !Array.isArray(obj.history)) return false
  if (obj.answers !== undefined && (typeof obj.answers !== 'object' || obj.answers === null)) return false
  return true
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isPlausibleState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage disabled or full — fail silently, app still works in-memory
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
