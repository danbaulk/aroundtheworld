// Pure read-side derivations over TravelData for the gamification screens (no persistence).
import type { TravelData } from './types'
import { statusOf } from './reducer'
import { COUNTRIES, getCountry } from './data/countries'

export type PassportStamp = { a3: string; name: string; flag: string }
export type PassportYear = { year: number; stamps: PassportStamp[] }

/** Visited countries grouped by visit year — years chronological (ascending), names A–Z within a year. */
export function passportByYear(state: TravelData): PassportYear[] {
  const byYear = new Map<number, PassportStamp[]>()
  for (const [a3, entry] of Object.entries(state.countries)) {
    if (entry.status !== 'visited') continue
    const year = entry.visitedYear ?? 0
    const country = getCountry(a3)
    const stamp: PassportStamp = { a3, name: country?.name ?? a3, flag: country?.flag ?? '🏳️' }
    const list = byYear.get(year)
    if (list) list.push(stamp)
    else byYear.set(year, [stamp])
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, stamps]) => ({ year, stamps: stamps.sort((x, y) => x.name.localeCompare(y.name)) }))
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
