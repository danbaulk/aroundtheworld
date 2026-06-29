import { useState } from 'react'
import { useTravel } from '../travelContext'
import { statusOf } from '../reducer'
import { getCountry } from '../data/countries'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => CURRENT_YEAR - i)

type Props = {
  a3: string
  onClose: () => void
}

// Tap a country → this panel sets its visited/wishlist state (and, for visited, the year).
// Mount it with `key={a3}` so the year selector resets per country.
export default function CountryPanel({ a3, onClose }: Props) {
  const { state, dispatch } = useTravel()
  const country = getCountry(a3)
  const status = statusOf(state, a3)
  const [year, setYear] = useState<number>(state.countries[a3]?.visitedYear ?? CURRENT_YEAR)

  const btn = 'rounded-lg px-3 py-2 text-sm font-semibold transition'
  const active = 'text-white'
  const idle = 'bg-slate-100 text-slate-700 hover:bg-slate-200'

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
          onClick={() => dispatch({ type: 'setVisited', a3, year })}
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

        <label className="ml-auto flex items-center gap-1 text-sm text-slate-600">
          Year
          <select
            value={year}
            onChange={(e) => {
              const next = Number(e.target.value)
              setYear(next)
              // Keep an already-visited country's stored year in sync as you change it.
              if (status === 'visited') dispatch({ type: 'setVisited', a3, year: next })
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
