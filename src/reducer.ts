// Pure, framework-free state logic — no React imports (mirrors gymbuddy/src/reducer.ts).
import type { Action, CountryStatus, TravelData } from './types'
import { byA3, CONTINENTS, TOTAL_COUNTRIES } from './data/countries'
import type { Continent } from './data/countries'

export function travelReducer(state: TravelData, action: Action): TravelData {
  switch (action.type) {
    case 'addVisit': {
      const existing = state.countries[action.a3]
      const prevVisits = existing?.status === 'visited' ? existing.visits ?? [] : []
      return {
        ...state,
        countries: {
          ...state.countries,
          [action.a3]: { status: 'visited', visits: [...prevVisits, action.visit] },
        },
      }
    }
    case 'updateVisitNotes': {
      const existing = state.countries[action.a3]
      if (existing?.status !== 'visited' || !existing.visits) return state
      const visits = existing.visits.map((v) =>
        v.id === action.visitId ? { ...v, notes: action.notes } : v,
      )
      return { ...state, countries: { ...state.countries, [action.a3]: { ...existing, visits } } }
    }
    case 'removeVisit': {
      const existing = state.countries[action.a3]
      if (existing?.status !== 'visited' || !existing.visits) return state
      const visits = existing.visits.filter((v) => v.id !== action.visitId)
      const countries = { ...state.countries }
      // Last visit removed → the country returns to unvisited (keeps visited ⟺ ≥1 visit).
      if (visits.length === 0) delete countries[action.a3]
      else countries[action.a3] = { ...existing, visits }
      return { ...state, countries }
    }
    case 'setWishlist':
      return {
        ...state,
        countries: { ...state.countries, [action.a3]: { status: 'wishlist' } },
      }
    case 'clearCountry': {
      if (!(action.a3 in state.countries)) return state
      const countries = { ...state.countries }
      delete countries[action.a3]
      return { ...state, countries }
    }
    default:
      return state
  }
}

export function statusOf(state: TravelData, a3: string): CountryStatus | undefined {
  return state.countries[a3]?.status
}

export type Stats = {
  visitedCount: number
  wishlistCount: number
  percentOfWorld: number // 0–100, capped
  continentsCovered: number // out of CONTINENTS.length (7)
}

/** Derive the progress headline numbers from the visited/wishlist map. */
export function computeStats(state: TravelData): Stats {
  let visitedCount = 0
  let wishlistCount = 0
  const continents = new Set<Continent>()
  for (const [a3, entry] of Object.entries(state.countries)) {
    if (entry.status === 'visited') {
      visitedCount++
      const continent = byA3.get(a3)?.continent
      if (continent && CONTINENTS.includes(continent)) continents.add(continent)
    } else if (entry.status === 'wishlist') {
      wishlistCount++
    }
  }
  const percentOfWorld = Math.min(100, Math.round((visitedCount / TOTAL_COUNTRIES) * 100))
  return { visitedCount, wishlistCount, percentOfWorld, continentsCovered: continents.size }
}
