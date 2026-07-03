// Milestone badges — purely derived from visited data (no persistence). Shown on the Challenges tab.
import type { TravelData } from '../types'
import { computeStats, statusOf, type Stats } from '../reducer'
import { COUNTRIES, CONTINENTS } from './countries'

export type Badge = {
  id: string
  icon: string // emoji
  label: string
  description: string // doubles as the "how to earn" hint when locked
  /** Callers compute stats once per pass and thread it in, so each badge doesn't rescan the map. */
  earned: (state: TravelData, stats: Stats) => boolean
}

/** A continent is "complete" when every UN-member country in it is visited (Antarctica has none, so it's excluded). */
export function continentComplete(state: TravelData, continent: (typeof CONTINENTS)[number]): boolean {
  const members = COUNTRIES.filter((c) => c.counts && c.continent === continent)
  return members.length > 0 && members.every((c) => statusOf(state, c.a3) === 'visited')
}

export const BADGES: Badge[] = [
  { id: 'first-stamp', icon: '🧳', label: 'First stamp', description: 'Visit your first country.', earned: (_, stats) => stats.visitedCount >= 1 },
  { id: 'explorer', icon: '🌍', label: 'Explorer', description: 'Visit 10 countries.', earned: (_, stats) => stats.visitedCount >= 10 },
  { id: 'globetrotter', icon: '✈️', label: 'Globetrotter', description: 'Visit 25 countries.', earned: (_, stats) => stats.visitedCount >= 25 },
  { id: 'jet-setter', icon: '🏆', label: 'Jet-setter', description: 'Visit 50 countries.', earned: (_, stats) => stats.visitedCount >= 50 },
  { id: 'bucket-list', icon: '🪣', label: 'Bucket list', description: 'Visit a country from your bucket list.', earned: (s) => Object.values(s.countries).some((e) => e.status === 'visited' && e.fromBucketList) },
  { id: 'continent-complete', icon: '🧭', label: 'Continent complete', description: 'Visit every country in a single continent.', earned: (s) => CONTINENTS.some((c) => continentComplete(s, c)) },
  { id: 'seven-continents', icon: '🌐', label: 'Seven continents', description: 'Set foot on all 7 continents.', earned: (_, stats) => stats.continentsCovered === 7 },
]

/** The badges earned for the current state. */
export function earnedBadges(state: TravelData): Badge[] {
  const stats = computeStats(state)
  return BADGES.filter((b) => b.earned(state, stats))
}
