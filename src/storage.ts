// The single place that touches localStorage — the intended swap point for a real backend
// later (productionise). Versioned with step-migrations, mirroring pantry/src/lib/storage.ts.
import type { TravelData } from './types'

const STORAGE_KEY = 'aroundtheworld:data'
const CURRENT_VERSION = 3 as const

/** A scratch map starts blank — there is no demo seed (you scratch off your own countries). */
function defaultState(): TravelData {
  return { version: CURRENT_VERSION, countries: {} }
}

type AnyBlob = { version?: number } & Record<string, unknown>

function step(blob: AnyBlob): AnyBlob {
  switch (blob.version) {
    // v1 → v2: one `visitedYear` per country becomes an array of dated visits, each with its
    // own notes. Visited countries gain a single visit carrying the old year; wishlist entries
    // are untouched. The malformed-field coercion below keeps this defensive.
    case 1:
      return migrateV1toV2(blob)
    // v2 → v3: "wishlist" was renamed "bucket list"; the `status` literal follows. Visits also
    // gained an optional `month`, and entries an optional `fromBucketList` flag — both absent in
    // old data, so visited entries pass through unchanged.
    case 2:
      return migrateV2toV3(blob)
    default:
      throw new Error(`Unsupported aroundtheworld data version: ${blob.version}`)
  }
}

/** v1 CountryEntry was { status, visitedYear? }; v2 is { status, visits? }. */
function migrateV1toV2(blob: AnyBlob): AnyBlob {
  const countries = hasValidCountries(blob.countries) ? blob.countries : {}
  const next: Record<string, unknown> = {}
  for (const [a3, raw] of Object.entries(countries)) {
    const entry = raw as { status?: unknown; visitedYear?: unknown }
    if (entry?.status === 'visited') {
      const year = typeof entry.visitedYear === 'number' ? entry.visitedYear : 0
      next[a3] = { status: 'visited', visits: [{ id: crypto.randomUUID(), year }] }
    } else if (entry?.status === 'wishlist') {
      next[a3] = { status: 'wishlist' }
    }
  }
  return { version: 2, countries: next }
}

/** v2 status `'wishlist'` becomes `'bucketlist'`; everything else is preserved verbatim. */
function migrateV2toV3(blob: AnyBlob): AnyBlob {
  const countries = hasValidCountries(blob.countries) ? blob.countries : {}
  const next: Record<string, unknown> = {}
  for (const [a3, raw] of Object.entries(countries)) {
    const entry = raw as { status?: unknown }
    if (entry?.status === 'wishlist') next[a3] = { ...(raw as object), status: 'bucketlist' }
    else next[a3] = raw
  }
  return { version: 3, countries: next }
}

function hasValidCountries(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Bring a stored blob up to the current version, then coerce any malformed field to safe defaults.
 * Only steps *forward* (version < current): a blob from a newer/abandoned build (e.g. an earlier
 * dev branch's v2 with a `packing` field) keeps its `countries` and is re-stamped rather than
 * thrown away — so it never silently resets the user's map.
 */
function migrate(parsed: AnyBlob): TravelData {
  let blob = parsed
  while (typeof blob.version === 'number' && blob.version < CURRENT_VERSION) {
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
