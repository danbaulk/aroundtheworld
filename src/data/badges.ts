// Milestone badges — purely derived from visited data (no persistence). Shown on the Challenges tab.
import type { TravelData } from '../types'
import { computeStats, statusOf } from '../reducer'
import { COUNTRIES, CONTINENTS } from './countries'

export type Badge = {
  id: string
  icon: string // emoji
  label: string
  description: string // doubles as the "how to earn" hint when locked
  earned: (state: TravelData) => boolean
}

/** A continent is "complete" when every UN-member country in it is visited (Antarctica has none, so it's excluded). */
function continentComplete(state: TravelData, continent: (typeof CONTINENTS)[number]): boolean {
  const members = COUNTRIES.filter((c) => c.counts && c.continent === continent)
  return members.length > 0 && members.every((c) => statusOf(state, c.a3) === 'visited')
}

export const BADGES: Badge[] = [
  { id: 'first-stamp', icon: '🧳', label: 'First stamp', description: 'Visit your first country.', earned: (s) => computeStats(s).visitedCount >= 1 },
  { id: 'explorer', icon: '🌍', label: 'Explorer', description: 'Visit 10 countries.', earned: (s) => computeStats(s).visitedCount >= 10 },
  { id: 'globetrotter', icon: '✈️', label: 'Globetrotter', description: 'Visit 25 countries.', earned: (s) => computeStats(s).visitedCount >= 25 },
  { id: 'jet-setter', icon: '🏆', label: 'Jet-setter', description: 'Visit 50 countries.', earned: (s) => computeStats(s).visitedCount >= 50 },
  { id: 'continent-complete', icon: '🧭', label: 'Continent complete', description: 'Visit every country in a single continent.', earned: (s) => CONTINENTS.some((c) => continentComplete(s, c)) },
  { id: 'seven-continents', icon: '🌐', label: 'Seven continents', description: 'Set foot on all 7 continents.', earned: (s) => computeStats(s).continentsCovered === 7 },
]

/** The badges earned for the current state. */
export function earnedBadges(state: TravelData): Badge[] {
  return BADGES.filter((b) => b.earned(state))
}
