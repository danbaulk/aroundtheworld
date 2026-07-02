// Pure helpers for placing country name labels on the map (no persistence).
import { geoArea, geoCentroid } from 'd3-geo'
import type { Feature, MultiPolygon, Polygon } from 'geojson'

export type CountryFeature = Feature<Polygon | MultiPolygon>

/**
 * Where a country's label should sit. For multi-part countries the naive whole-geometry
 * centroid drifts offshore (France pulled mid-Atlantic by French Guiana, USA pulled north-west
 * by Alaska), so anchor on the centroid of the largest polygon instead.
 */
export function labelAnchor(geo: CountryFeature): [number, number] {
  const geom = geo.geometry
  if (geom.type === 'MultiPolygon') {
    let largest = geom.coordinates[0]
    let largestArea = -Infinity
    for (const polygon of geom.coordinates) {
      const area = geoArea({ type: 'Polygon', coordinates: polygon })
      if (area > largestArea) {
        largestArea = area
        largest = polygon
      }
    }
    return geoCentroid({ type: 'Polygon', coordinates: largest })
  }
  return geoCentroid(geo)
}

// Bigger countries get labelled at lower zoom so the world view isn't a wall of text.
// Areas are spherical (steradians): 1 sr ≈ 40.6M km², so the cuts land at roughly
// 2M km² (giants), 400k km² (large) and 60k km² (mid).
const TIERS = [
  { minArea: 0.05, minZoom: 1 }, // giants: Russia, Canada, USA, Brazil, China…
  { minArea: 0.01, minZoom: 2 }, // large: France, Spain, Ukraine, Egypt…
  { minArea: 0.0015, minZoom: 3.5 }, // mid: Portugal, Austria, Ireland…
  { minArea: 0, minZoom: 6 }, // small: Luxembourg, islands, city states
] as const

/** The zoom level at which a country of the given spherical area earns its label. */
export function minZoomForArea(area: number): number {
  return TIERS.find((t) => area >= t.minArea)!.minZoom
}
