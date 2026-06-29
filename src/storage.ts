// The single place that touches localStorage — the intended swap point for a real backend
// later (productionise). Versioned with step-migrations, mirroring pantry/src/lib/storage.ts.
import type { TravelData } from './types'

const STORAGE_KEY = 'aroundtheworld:data'
const CURRENT_VERSION = 1 as const

/** A scratch map starts blank — there is no demo seed (you scratch off your own countries). */
export function defaultState(): TravelData {
  return { version: CURRENT_VERSION, countries: {} }
}

type AnyBlob = { version?: number } & Record<string, unknown>

function step(blob: AnyBlob): AnyBlob {
  switch (blob.version) {
    // Version 1 is the first shape, so there are no migration steps yet. When Phase 2
    // changes the shape, bump CURRENT_VERSION and add `case 1:` here returning the v2 blob,
    // so an old saved map upgrades one step at a time instead of being reset.
    default:
      throw new Error(`Unsupported aroundtheworld data version: ${blob.version}`)
  }
}

function hasValidCountries(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/** Bring a stored blob up to the current version, then coerce any malformed field to safe defaults. */
function migrate(parsed: AnyBlob): TravelData {
  let blob = parsed
  while (blob.version !== CURRENT_VERSION) {
    blob = step(blob)
  }
  const countries = hasValidCountries(blob.countries) ? (blob.countries as TravelData['countries']) : {}
  return { version: CURRENT_VERSION, countries }
}

/** Read persisted state. On first run or any parse/version failure, fall back to a blank map. */
export function load(): TravelData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = defaultState()
      save(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw)
    const migrated = migrate(parsed)
    if (migrated.version !== parsed.version) save(migrated)
    return migrated
  } catch {
    return defaultState()
  }
}

export function save(data: TravelData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable or full — acceptable to drop for a local-only prototype.
  }
}
