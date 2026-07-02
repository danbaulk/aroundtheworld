// Maps each earned badge back to the passport stamps that earned it (no persistence — all derived).
// For every earned badge we produce its *contributing* stamps in chronological order; the LAST one
// is the "earning" stamp — the visit whose addition first made the badge true. See docs table.
import type { TravelData, Visit } from './types'
import { byMonthThenName, type PassportStamp } from './selectors'
import { BADGES, continentComplete, type Badge } from './data/badges'
import { COUNTRIES, CONTINENTS, byA3, getCountry } from './data/countries'

/** Stable key for a single stamp (country + visit) — shared with the Passport tab lookup. */
export const stampKey = (a3: string, visitId: string): string => `${a3}:${visitId}`

export type EarnedBadge = { badge: Badge; contributing: PassportStamp[]; earning: PassportStamp }

function stampFor(a3: string, visit: Visit): PassportStamp {
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

/** Chronological: year, then month (unknown sorts first), then name, then visitId (stable). */
function byChrono(a: PassportStamp, b: PassportStamp): number {
  return a.year - b.year || byMonthThenName(a, b) || a.visitId.localeCompare(b.visitId)
}

/** One stamp per visited country — its earliest visit ("acquisition") — sorted chronologically. */
function acquisitionStamps(state: TravelData): PassportStamp[] {
  const stamps: PassportStamp[] = []
  for (const [a3, entry] of Object.entries(state.countries)) {
    if (entry.status !== 'visited' || !entry.visits || entry.visits.length === 0) continue
    const earliest = entry.visits.reduce((min, v) =>
      v.year < min.year || (v.year === min.year && (v.month ?? 0) < (min.month ?? 0)) ? v : min,
    )
    stamps.push(stampFor(a3, earliest))
  }
  return stamps.sort(byChrono)
}

/** The first `n` acquisition stamps (the run that reached a count milestone), or [] if not reached. */
function firstN(state: TravelData, n: number): PassportStamp[] {
  const acq = acquisitionStamps(state)
  return acq.length >= n ? acq.slice(0, n) : []
}

/** Every member's acquisition stamp for the continent that was completed earliest, or []. */
function continentCompleteStamps(state: TravelData): PassportStamp[] {
  const acqByA3 = new Map(acquisitionStamps(state).map((s) => [s.a3, s]))
  let best: PassportStamp[] | null = null
  for (const continent of CONTINENTS) {
    if (!continentComplete(state, continent)) continue
    const members = COUNTRIES.filter((c) => c.counts && c.continent === continent)
    const stamps = members
      .map((c) => acqByA3.get(c.a3))
      .filter((s): s is PassportStamp => Boolean(s))
      .sort(byChrono)
    if (stamps.length !== members.length) continue // completeness guarantees every member has a stamp
    const earner = stamps[stamps.length - 1]
    if (!best || byChrono(earner, best[best.length - 1]) < 0) best = stamps
  }
  return best ?? []
}

/** One "coverage" stamp per continent (earliest visit there), or [] unless all 7 are covered. */
function sevenContinentStamps(state: TravelData): PassportStamp[] {
  const acq = acquisitionStamps(state) // already chronological, so find() yields the earliest
  const coverage: PassportStamp[] = []
  for (const continent of CONTINENTS) {
    const first = acq.find((s) => byA3.get(s.a3)?.continent === continent)
    if (!first) return [] // continent not covered → badge not earned
    coverage.push(first)
  }
  return coverage.sort(byChrono)
}

/** Contributing stamps for a badge (chronological; last = earner), or [] if it doesn't apply. */
function contributingFor(badgeId: string, state: TravelData): PassportStamp[] {
  switch (badgeId) {
    case 'first-stamp':
      return firstN(state, 1)
    case 'explorer':
      return firstN(state, 10)
    case 'globetrotter':
      return firstN(state, 25)
    case 'jet-setter':
      return firstN(state, 50)
    case 'bucket-list':
      return acquisitionStamps(state)
        .filter((s) => state.countries[s.a3]?.fromBucketList)
        .slice(0, 1)
    case 'continent-complete':
      return continentCompleteStamps(state)
    case 'seven-continents':
      return sevenContinentStamps(state)
    default:
      return []
  }
}

/** Every earned badge paired with the stamps that earned it (kept consistent with `badge.earned`). */
export function earnedBadgeStamps(state: TravelData): EarnedBadge[] {
  const result: EarnedBadge[] = []
  for (const badge of BADGES) {
    if (!badge.earned(state)) continue
    const contributing = contributingFor(badge.id, state)
    if (contributing.length === 0) continue
    result.push({ badge, contributing, earning: contributing[contributing.length - 1] })
  }
  return result
}

/** Map of stampKey(earning) → the badge(s) earned *at* that stamp, for the Passport tab. */
export function badgesByStamp(state: TravelData): Map<string, Badge[]> {
  const map = new Map<string, Badge[]>()
  for (const { badge, earning } of earnedBadgeStamps(state)) {
    const key = stampKey(earning.a3, earning.visitId)
    const list = map.get(key)
    if (list) list.push(badge)
    else map.set(key, [badge])
  }
  return map
}
