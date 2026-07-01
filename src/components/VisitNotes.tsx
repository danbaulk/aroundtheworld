import { useState } from 'react'
import { useTravel } from '../travelContext'
import { getCountry } from '../data/countries'
import { formatVisitDate } from '../selectors'
import ConfirmDialog from './ConfirmDialog'
import PhotosPlaceholder from './PhotosPlaceholder'

type Props = {
  a3: string
  visitId: string
  onClose: () => void
}

// A centred-card pop-up for a single visit's notes & photos, opened by tapping a passport stamp
// (Passport tab) or a visit row (CountryPanel). Mirrors the CountryTips overlay pattern.
// Notes are kept in local state and persisted on blur / close to avoid a dispatch per keystroke.
export default function VisitNotes({ a3, visitId, onClose }: Props) {
  const { state, dispatch } = useTravel()
  const country = getCountry(a3)
  const entry = state.countries[a3]
  const visit = entry?.status === 'visited' ? entry.visits?.find((v) => v.id === visitId) : undefined

  const [notes, setNotes] = useState(visit?.notes ?? '')
  const [confirmRemove, setConfirmRemove] = useState(false)

  const persist = () => {
    if (visit && notes !== (visit.notes ?? '')) {
      dispatch({ type: 'updateVisitNotes', a3, visitId, notes })
    }
  }

  const close = () => {
    persist()
    onClose()
  }

  const remove = () => {
    dispatch({ type: 'removeVisit', a3, visitId })
    onClose()
  }

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-[90%] max-w-md flex-col rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <span aria-hidden>{country?.flag}</span>
            {country?.name ?? a3}
            {visit && <span className="font-medium text-slate-400">· {formatVisitDate(visit)}</span>}
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="rounded-full px-2 text-xl leading-none text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {visit ? (
          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={persist}
                placeholder="Add notes about this visit…"
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
            </div>

            <PhotosPlaceholder />

            <button
              onClick={() => setConfirmRemove(true)}
              className="self-start text-sm font-medium text-rose-500 hover:text-rose-700 hover:underline"
            >
              Remove visit
            </button>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">This visit no longer exists.</div>
        )}
      </div>

      {confirmRemove && (
        <ConfirmDialog
          message="Remove this visit? This can't be undone."
          confirmLabel="Remove"
          onConfirm={remove}
          onCancel={() => setConfirmRemove(false)}
        />
      )}
    </div>
  )
}
