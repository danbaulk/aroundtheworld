// Pure read-side derivations over TravelData for the gamification screens (no persistence).
import type { TravelData, Visit } from './types'
import { statusOf } from './reducer'
import { COUNTRIES, getCountry } from './data/countries'

export type PassportStamp = { a3: string; visitId: string; year: number; name: string; flag: string }
export type PassportYear = { year: number; stamps: PassportStamp[] }

/** One stamp per visit, grouped by visit year — years chronological (ascending), names A–Z within a year. */
export function passportByYear(state: TravelData): PassportYear[] {
  const byYear = new Map<number, PassportStamp[]>()
  for (const [a3, entry] of Object.entries(state.countries)) {
    if (entry.status !== 'visited' || !entry.visits) continue
    const country = getCountry(a3)
    for (const visit of entry.visits) {
      const stamp: PassportStamp = {
        a3,
        visitId: visit.id,
        year: visit.year,
        name: country?.name ?? a3,
        flag: country?.flag ?? '🏳️',
      }
      const list = byYear.get(visit.year)
      if (list) list.push(stamp)
      else byYear.set(visit.year, [stamp])
    }
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, stamps]) => ({ year, stamps: stamps.sort((x, y) => x.name.localeCompare(y.name)) }))
}

/** A visited country's visits, most-recent year first, for the country panel list. */
export function visitsForCountry(state: TravelData, a3: string): Visit[] {
  const entry = state.countries[a3]
  if (entry?.status !== 'visited' || !entry.visits) return []
  return [...entry.visits].sort((a, b) => b.year - a.year)
}

/**
 * A random unvisited country's alpha-3, for the dart throw. Prefers a *truly new* UN-member
 * country (neither visited nor wishlisted); falls back to any non-visited member; `undefined`
 * once every country is visited.
 */
export function pickRandomUnvisited(state: TravelData): string | undefined {
  const fresh = COUNTRIES.filter((c) => c.counts && statusOf(state, c.a3) === undefined)
  const pool = fresh.length > 0 ? fresh : COUNTRIES.filter((c) => c.counts && statusOf(state, c.a3) !== 'visited')
  if (pool.length === 0) return undefined
  return pool[Math.floor(Math.random() * pool.length)].a3
}
