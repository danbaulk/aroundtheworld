import { useState } from 'react'
import ProgressStats from './ProgressStats'
import WorldMap from './WorldMap'
import CountryPanel from './CountryPanel'

export default function MapTab() {
  const [selectedA3, setSelectedA3] = useState<string | null>(null)

  return (
    <div className="relative flex h-full flex-col gap-3 p-3">
      <ProgressStats />
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-sky-50 ring-1 ring-slate-200">
        <WorldMap selectedA3={selectedA3} onSelect={setSelectedA3} />
      </div>
      {selectedA3 && (
        <CountryPanel key={selectedA3} a3={selectedA3} onClose={() => setSelectedA3(null)} />
      )}
    </div>
  )
}
