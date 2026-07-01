import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
// Bundled as a same-origin asset URL (no third-party network). vite/client types this as a
// string, which the Geographies `geography` prop fetches + converts from TopoJSON at runtime.
import countriesUrl from 'world-atlas/countries-110m.json?url'
import { useTravel } from '../travelContext'
import { statusOf } from '../reducer'
import { lookupGeo } from '../data/countries'

const FILL = {
  unvisited: '#e2e8f0', // slate-200
  visited: '#16a34a', // green-600
  bucketlist: '#f59e0b', // amber-500
} as const

type Props = {
  selectedA3: string | null
  onSelect: (a3: string) => void
}

export default function WorldMap({ selectedA3, onSelect }: Props) {
  const { state } = useTravel()

  return (
    <ComposableMap className="h-full w-full">
      <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={8}>
        <Geographies geography={countriesUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = lookupGeo(geo.id, geo.properties?.name)
              const a3 = country?.a3
              const status = a3 ? statusOf(state, a3) : undefined
              const fill = status ? FILL[status] : FILL.unvisited
              const isSelected = !!a3 && a3 === selectedA3
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (a3) onSelect(a3)
                  }}
                  style={{
                    default: {
                      fill,
                      stroke: isSelected ? '#1e293b' : '#ffffff',
                      strokeWidth: isSelected ? 1 : 0.3,
                      outline: 'none',
                    },
                    hover: {
                      fill: country ? '#60a5fa' : fill, // unmatched features aren't interactive
                      outline: 'none',
                      cursor: country ? 'pointer' : 'default',
                    },
                    pressed: { fill: '#3b82f6', outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  )
}
