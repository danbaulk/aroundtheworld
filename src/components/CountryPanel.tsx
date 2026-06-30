import { useState } from 'react'
import { useTravel } from '../travelContext'
import { statusOf } from '../reducer'
import { visitsForCountry } from '../selectors'
import { getCountry } from '../data/countries'
import CountryTips from './CountryTips'
import VisitNotes from './VisitNotes'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => CURRENT_YEAR - i)

type Props = {
  a3: string
  onClose: () => void
}

// Tap a country → this panel sets its visited/wishlist state. A visited country lists its dated
// visits (stamps); tap one to open its notes, or add another visit for a different year.
// Mount it with `key={a3}` so the year selector resets per country.
export default function CountryPanel({ a3, onClose }: Props) {
  const { state, dispatch } = useTravel()
  const country = getCountry(a3)
  const status = statusOf(state, a3)
  const visits = visitsForCountry(state, a3)
  const [year, setYear] = useState<number>(CURRENT_YEAR)
  const [showTips, setShowTips] = useState(false)
  const [openVisit, setOpenVisit] = useState<string | null>(null)

  const btn = 'rounded-lg px-3 py-2 text-sm font-semibold transition'
  const active = 'text-white'
  const idle = 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  const addVisit = () => dispatch({ type: 'addVisit', a3, visit: { id: crypto.randomUUID(), year } })

  const yearSelect = (
    <select
      value={year}
      onChange={(e) => setYear(Number(e.target.value))}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
    >
      {YEARS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )

  return (
    <div className="fixed inset-x-0 bottom-14 z-10 mx-auto max-w-md rounded-t-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:bottom-16">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <span aria-hidden>{country?.flag}</span>
          {country?.name ?? a3}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full px-2 text-xl leading-none text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (status !== 'visited') addVisit()
          }}
          className={`${btn} ${status === 'visited' ? `${active} bg-green-600` : idle}`}
        >
          Visited
        </button>
        <button
          onClick={() => dispatch({ type: 'setWishlist', a3 })}
          className={`${btn} ${status === 'wishlist' ? `${active} bg-amber-500` : idle}`}
        >
          Wishlist
        </button>
        <button
          onClick={() => dispatch({ type: 'clearCountry', a3 })}
          disabled={!status}
          className={`${btn} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          Clear
        </button>

        {status !== 'visited' && (
          <label className="ml-auto flex items-center gap-1 text-sm text-slate-600">
            Year
            {yearSelect}
          </label>
        )}
      </div>

      {status === 'visited' && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Your visits
          </p>
          <div className="flex flex-col gap-1">
            {visits.map((v) => (
              <button
                key={v.id}
                onClick={() => setOpenVisit(v.id)}
                className="flex w-full items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-left ring-1 ring-slate-200 transition hover:ring-sky-300"
              >
                <span className="text-sm font-semibold text-slate-700">{v.year}</span>
                <span className="truncate text-xs text-slate-400">
                  {v.notes?.trim() || 'No notes yet'}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {yearSelect}
            <button
              onClick={addVisit}
              className={`${btn} ${active} bg-green-600 hover:bg-green-700`}
            >
              + Add visit
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowTips(true)}
        className="mt-3 w-full rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
      >
        💡 Travel tips
      </button>

      {showTips && <CountryTips a3={a3} onClose={() => setShowTips(false)} />}
      {openVisit && (
        <VisitNotes a3={a3} visitId={openVisit} onClose={() => setOpenVisit(null)} />
      )}
    </div>
  )
}
