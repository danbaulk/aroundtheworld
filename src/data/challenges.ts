// Curated challenges with auto-progress — purely derived from visited data (no persistence).
import type { TravelData } from '../types'
import { statusOf, type Stats } from '../reducer'
import { COUNTRIES } from './countries'

export type ChallengeProgress = { current: number; target: number }

export type Challenge = {
  id: string
  label: string
  description: string
  /** Callers compute stats once per pass and thread it in, so each challenge doesn't rescan the map. */
  progress: (state: TravelData, stats: Stats) => ChallengeProgress
}

// Nordic is narrower than the "Northern Europe" subregion (which also includes the UK, Ireland,
// the Baltics…), so it needs an explicit set.
const NORDIC = ['DNK', 'NOR', 'SWE', 'FIN', 'ISL']

/** How many UN-member countries matching `predicate` have been visited. */
function visitedIn(state: TravelData, predicate: (c: (typeof COUNTRIES)[number]) => boolean): number {
  return COUNTRIES.filter((c) => c.counts && predicate(c) && statusOf(state, c.a3) === 'visited').length
}

const SOUTH_AMERICA_TOTAL = COUNTRIES.filter((c) => c.counts && c.continent === 'South America').length
const SE_ASIA_TOTAL = COUNTRIES.filter((c) => c.counts && c.subregion === 'South-Eastern Asia').length

export const CHALLENGES: Challenge[] = [
  {
    id: 'seven-continents',
    label: 'Around the world',
    description: 'Set foot on all 7 continents.',
    progress: (_, stats) => ({ current: stats.continentsCovered, target: 7 }),
  },
  {
    id: 'nordic',
    label: 'Nordic explorer',
    description: 'Visit the 5 Nordic countries.',
    progress: (s) => ({ current: NORDIC.filter((a3) => statusOf(s, a3) === 'visited').length, target: NORDIC.length }),
  },
  {
    id: 'south-america',
    label: 'Conquer South America',
    description: 'Visit every country in South America.',
    progress: (s) => ({ current: visitedIn(s, (c) => c.continent === 'South America'), target: SOUTH_AMERICA_TOTAL }),
  },
  {
    id: 'southeast-asia',
    label: 'South-East Asia tour',
    description: 'Visit every country in South-Eastern Asia.',
    progress: (s) => ({ current: visitedIn(s, (c) => c.subregion === 'South-Eastern Asia'), target: SE_ASIA_TOTAL }),
  },
  {
    id: 'century-club',
    label: 'Century club',
    description: 'Visit 100 countries.',
    progress: (_, stats) => ({ current: stats.visitedCount, target: 100 }),
  },
]

export function isComplete(p: ChallengeProgress): boolean {
  return p.current >= p.target
}
