import { useTravel } from '../travelContext'
import { computeStats } from '../reducer'
import { CONTINENTS, TOTAL_COUNTRIES } from '../data/countries'

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-xl bg-white px-2 py-3 shadow-sm ring-1 ring-slate-200">
      <span className="text-2xl font-bold tabular-nums text-slate-800">{value}</span>
      <span className="text-center text-xs text-slate-500">{label}</span>
    </div>
  )
}

export default function ProgressStats() {
  const { state } = useTravel()
  const stats = computeStats(state)
  return (
    <div className="flex gap-2">
      <Stat value={`${stats.visitedCount}`} label={`of ${TOTAL_COUNTRIES} countries`} />
      <Stat value={`${stats.percentOfWorld}%`} label="of the world" />
      <Stat value={`${stats.continentsCovered}/${CONTINENTS.length}`} label="continents" />
      <Stat value={`${stats.bucketListCount}`} label="on bucket list" />
    </div>
  )
}
