import { COUNTRIES } from './countries.generated'
import type { Continent, Country } from './countries.generated'

export type { Continent, Country }
export { COUNTRIES }

/** The classic seven continents, used for "X of 7" style progress. */
export const CONTINENTS: readonly Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica',
]

/** Lookup by ISO alpha-3 (the key used for persisted state). */
export const byA3: ReadonlyMap<string, Country> = new Map(COUNTRIES.map((c) => [c.a3, c]))

/** Lookup by ISO numeric id (matches the ids on world-atlas TopoJSON features). */
const byNumericId: ReadonlyMap<string, Country> = new Map(
  COUNTRIES.filter((c) => c.numericId !== '').map((c) => [c.numericId, c]),
)

/**
 * world-atlas marks three rendered features with id "-99" (no ISO numeric code), so they
 * can't be matched numerically. Map them by their TopoJSON `properties.name` instead, so
 * the user can still scratch them off. None are UN members (they don't affect the % denominator).
 */
const GEO_NAME_OVERRIDES: Record<string, Country> = {
  Kosovo: { a3: 'UNK', numericId: '', name: 'Kosovo', continent: 'Europe', subregion: 'Southeast Europe', flag: '🇽🇰', counts: false },
  'N. Cyprus': { a3: 'CYN', numericId: '', name: 'Northern Cyprus', continent: 'Europe', subregion: 'Southeast Europe', flag: '🏳️', counts: false },
  Somaliland: { a3: 'SOL', numericId: '', name: 'Somaliland', continent: 'Africa', subregion: 'Eastern Africa', flag: '🏳️', counts: false },
}

/** Total UN-member countries — the denominator for "% of the world". */
export const TOTAL_COUNTRIES = COUNTRIES.filter((c) => c.counts).length

/** Resolve a world-atlas geography (its numeric `id`, falling back to its `name`) to a Country. */
export function lookupGeo(geoId: string | number | undefined | null, geoName: string | undefined | null): Country | undefined {
  if (geoId != null && geoId !== '') {
    const hit = byNumericId.get(String(Number(geoId)))
    if (hit) return hit
  }
  if (geoName && geoName in GEO_NAME_OVERRIDES) return GEO_NAME_OVERRIDES[geoName]
  return undefined
}

/** The Country for a persisted state key (handles the synthetic -99 territories too). */
export function getCountry(a3: string): Country | undefined {
  return byA3.get(a3) ?? Object.values(GEO_NAME_OVERRIDES).find((c) => c.a3 === a3)
}
