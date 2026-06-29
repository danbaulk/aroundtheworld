// Domain model for Around the World (Phase 1 — the scratch map).

export type CountryStatus = 'visited' | 'wishlist' // absence of an entry == unvisited

export type CountryEntry = {
  status: CountryStatus
  visitedYear?: number // set when status === 'visited'
}

export type TravelData = {
  version: 1 // schema version — bump + add a migration step in storage.ts on shape changes
  countries: Record<string, CountryEntry> // keyed by ISO alpha-3
}

export type Action =
  | { type: 'setVisited'; a3: string; year: number }
  | { type: 'setWishlist'; a3: string }
  | { type: 'clearCountry'; a3: string }
