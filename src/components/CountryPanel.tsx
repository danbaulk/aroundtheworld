import { useState } from 'react'
import { useTravel } from '../travelContext'
import { statusOf } from '../reducer'
import { formatVisitDate, visitsForCountry } from '../selectors'
import { getCountry } from '../data/countries'
import AddVisit from './AddVisit'
import CountryTips from './CountryTips'
import VisitNotes from './VisitNotes'

type Props = {
  a3: string
  onClose: () => void
}

// Tap a country → this panel. Top-right is a bucket-list toggle (or a tick once visited).
// "+ Add visit" opens a form to log a dated visit; a visited country lists its visits (stamps) —
// tap one to open its notes. Mount with `key={a3}` so transient panel state resets per country.
export default function CountryPanel({ a3, onClose }: Props) {
  const { state, dispatch } = useTravel()
  const country = getCountry(a3)
  const status = statusOf(state, a3)
  const visits = visitsForCountry(state, a3)
  const [showTips, setShowTips] = useState(false)
  const [showAddVisit, setShowAddVisit] = useState(false)
  const [openVisit, setOpenVisit] = useState<string | null>(null)

  const corner = 'rounded-full px-2 text-xl leading-none transition'

  return (
    <div className="fixed inset-x-0 bottom-14 z-10 mx-auto max-w-md rounded-t-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:bottom-16">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <span aria-hidden>{country?.flag}</span>
          {country?.name ?? a3}
        </h2>
        <div className="flex items-center gap-1">
          {status === 'visited' ? (
            <span
              aria-label="Visited"
              title="Visited"
              className={`${corner} text-green-600`}
            >
              ✓
            </span>
          ) : (
            <button
              onClick={() => dispatch({ type: 'toggleBucketList', a3 })}
              aria-pressed={status === 'bucketlist'}
              aria-label={status === 'bucketlist' ? 'Remove from bucket list' : 'Add to bucket list'}
              title="Bucket list"
              className={`${corner} ${
                status === 'bucketlist'
                  ? 'opacity-100'
                  : 'opacity-40 grayscale hover:opacity-80 hover:grayscale-0'
              }`}
            >
              🪣
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className={`${corner} text-slate-400 hover:text-slate-700`}
          >
            ×
          </button>
        </div>
      </div>

      {visits.length > 0 && (
        <div className="mb-3">
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
                <span className="text-sm font-semibold text-slate-700">{formatVisitDate(v)}</span>
                <span className="truncate text-xs text-slate-400">
                  {v.notes?.trim() || 'No notes yet'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowAddVisit(true)}
        className="w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
      >
        + Add visit
      </button>

      <button
        onClick={() => setShowTips(true)}
        className="mt-2 w-full rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
      >
        💡 Travel tips
      </button>

      {showAddVisit && <AddVisit a3={a3} onClose={() => setShowAddVisit(false)} />}
      {showTips && <CountryTips a3={a3} onClose={() => setShowTips(false)} />}
      {openVisit && (
        <VisitNotes a3={a3} visitId={openVisit} onClose={() => setOpenVisit(null)} />
      )}
    </div>
  )
}
