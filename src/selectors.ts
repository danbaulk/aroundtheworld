// Pure read-side derivations over TravelData for the gamification screens (no persistence).
import type { TravelData, Visit } from './types'
import { statusOf } from './reducer'
import { COUNTRIES, getCountry } from './data/countries'

export type PassportStamp = { a3: string; visitId: string; year: number; month?: number; name: string; flag: string }
export type PassportYear = { year: number; stamps: PassportStamp[] }

/** Short month names, indexed 1–12 (index 0 unused) — shared by the picker and the formatter. */
export const MONTHS = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/** The short name for a 1–12 month number, or '' when the month is absent or out of range. */
export function monthName(month?: number): string {
  return month && month >= 1 && month <= 12 ? MONTHS[month] : ''
}

/** A visit's date for display: "Mar 2024" when the month is known, else just "2024". */
export function formatVisitDate(visit: Pick<Visit, 'year' | 'month'>): string {
  const name = monthName(visit.month)
  return name ? `${name} ${visit.year}` : `${visit.year}`
}

/** The passport stamp for one visit to a country (falls back to the raw a3 / a plain flag). */
export function stampFor(a3: string, visit: Visit): PassportStamp {
  const country = getCountry(a3)
  return {
    a3,
    visitId: visit.id,
    year: visit.year,
    month: visit.month,
    name: country?.name ?? a3,
    flag: country?.flag ?? '🏳️',
  }
}

/** Chronological within a year: month ascending (unknown months first), then name A–Z. */
export function byMonthThenName(
  a: Pick<PassportStamp, 'month' | 'name'>,
  b: Pick<PassportStamp, 'month' | 'name'>,
): number {
  return (a.month ?? 0) - (b.month ?? 0) || a.name.localeCompare(b.name)
}

/**
 * One stamp per visit, grouped by visit year — years chronological (ascending); within a year,
 * chronological by month (month-less visits first), names A–Z as the tie-break.
 */
export function passportByYear(state: TravelData): PassportYear[] {
  const byYear = new Map<number, PassportStamp[]>()
  for (const [a3, entry] of Object.entries(state.countries)) {
    if (entry.status !== 'visited' || !entry.visits) continue
    for (const visit of entry.visits) {
      const stamp = stampFor(a3, visit)
      const list = byYear.get(visit.year)
      if (list) list.push(stamp)
      else byYear.set(visit.year, [stamp])
    }
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, stamps]) => ({ year, stamps: stamps.sort(byMonthThenName) }))
}

/** A visited country's visits, most-recent year first, for the country panel list. */
export function visitsForCountry(state: TravelData, a3: string): Visit[] {
  const entry = state.countries[a3]
  if (entry?.status !== 'visited' || !entry.visits) return []
  return [...entry.visits].sort((a, b) => b.year - a.year)
}

/**
 * A random unvisited country's alpha-3, for the dart throw. Prefers a *truly new* UN-member
 * country (neither visited nor bucket-listed); falls back to any non-visited member; `undefined`
 * once every country is visited.
 */
export function pickRandomUnvisited(state: TravelData): string | undefined {
  const fresh = COUNTRIES.filter((c) => c.counts && statusOf(state, c.a3) === undefined)
  const pool = fresh.length > 0 ? fresh : COUNTRIES.filter((c) => c.counts && statusOf(state, c.a3) !== 'visited')
  if (pool.length === 0) return undefined
  return pool[Math.floor(Math.random() * pool.length)].a3
}
