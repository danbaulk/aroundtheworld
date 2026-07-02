import { useMemo } from 'react'
import { Marker } from 'react-simple-maps'
import { geoArea } from 'd3-geo'
import { lookupGeo } from '../data/countries'
import { labelAnchor, minZoomForArea, type CountryFeature } from '../mapLabels'

type Props = {
  geographies: Array<CountryFeature & { id?: string | number; rsmKey: string }>
  zoom: number
}

// Country names drawn over the map. Which names show depends on zoom: only the giant
// countries at world view, progressively smaller ones as you zoom in (see mapLabels TIERS).
// Font size counter-scales with zoom so labels keep a constant apparent size, and the whole
// layer ignores pointer events so taps still land on the countries beneath.
export default function CountryLabels({ geographies, zoom }: Props) {
  // Centroids, areas and tiers are static per geography set — compute them once.
  const labels = useMemo(
    () =>
      geographies.flatMap((geo) => {
        const country = lookupGeo(geo.id, geo.properties?.name)
        if (!country) return [] // unmatched features aren't interactive, so no label either
        return [
          {
            key: geo.rsmKey,
            name: country.name,
            coordinates: labelAnchor(geo),
            minZoom: minZoomForArea(geoArea(geo)),
          },
        ]
      }),
    [geographies],
  )

  const fontSize = 14 / zoom
  return (
    <g aria-hidden style={{ pointerEvents: 'none' }}>
      {labels
        .filter((l) => zoom >= l.minZoom)
        .map((l) => (
          <Marker key={l.key} coordinates={l.coordinates}>
            <text
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight={600}
              style={{
                fill: '#334155', // slate-700
                stroke: '#f8fafc', // slate-50 halo for legibility on any country fill
                strokeWidth: fontSize / 5,
                strokeLinejoin: 'round',
                paintOrder: 'stroke',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {l.name}
            </text>
          </Marker>
        ))}
    </g>
  )
}
