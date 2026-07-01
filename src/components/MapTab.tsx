import { useState } from 'react'
import ProgressStats from './ProgressStats'
import WorldMap from './WorldMap'
import CountryPanel from './CountryPanel'
import { useTravel } from '../travelContext'
import { statusOf } from '../reducer'
import { pickRandomUnvisited } from '../selectors'
import { COUNTRIES, getCountry } from '../data/countries'

export default function MapTab() {
  const { state } = useTravel()
  const [selectedA3, setSelectedA3] = useState<string | null>(null)
  // Whether the current selection came from the dart (drives the suggestion banner).
  const [darted, setDarted] = useState(false)

  const allVisited = COUNTRIES.every((c) => !c.counts || statusOf(state, c.a3) === 'visited')

  function throwDart() {
    const a3 = pickRandomUnvisited(state)
    if (!a3) return
    setSelectedA3(a3)
    setDarted(true)
  }

  function select(a3: string) {
    setSelectedA3(a3)
    setDarted(false)
  }

  function close() {
    setSelectedA3(null)
    setDarted(false)
  }

  const suggestion = darted && selectedA3 ? getCountry(selectedA3) : undefined

  return (
    <div className="relative flex h-full flex-col gap-3 p-3">
      <ProgressStats />
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-sky-50 ring-1 ring-slate-200">
        <WorldMap selectedA3={selectedA3} onSelect={select} />
        <button
          onClick={throwDart}
          disabled={allVisited}
          className="absolute right-3 top-3 z-10 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-sky-700/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          🎯 {allVisited ? 'All visited!' : 'Throw a dart'}
        </button>
      </div>
      {suggestion && (
        <div className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800 ring-1 ring-sky-200">
          🎯 Suggested for you:{' '}
          <span className="font-semibold">
            {suggestion.flag} {suggestion.name}
          </span>{' '}
          — add it to your bucket list below, or{' '}
          <button onClick={throwDart} className="font-semibold underline">
            throw again
          </button>
          .
        </div>
      )}
      {selectedA3 && <CountryPanel key={selectedA3} a3={selectedA3} onClose={close} />}
    </div>
  )
}
