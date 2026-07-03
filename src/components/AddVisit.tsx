import { useState } from 'react'
import { useTravel } from '../travelContext'
import { getCountry } from '../data/countries'
import { MONTHS } from '../selectors'
import Modal, { ModalHeader } from './Modal'
import PhotosPlaceholder from './PhotosPlaceholder'

const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => CURRENT_YEAR - i)
const MONTH_OPTIONS = MONTHS.map((name, i) => ({ value: i, name })).slice(1) // drop the [0] blank

type Props = {
  a3: string
  onClose: () => void
}

// Centred-card form for logging a new dated visit (month + year + notes; photos a placeholder).
// Mirrors the VisitNotes / CountryTips overlay pattern. Defaults to the current month and year.
export default function AddVisit({ a3, onClose }: Props) {
  const { dispatch } = useTravel()
  const country = getCountry(a3)
  const [month, setMonth] = useState(NOW.getMonth() + 1)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [notes, setNotes] = useState('')

  const save = () => {
    dispatch({
      type: 'addVisit',
      a3,
      visit: { id: crypto.randomUUID(), year, month, notes: notes.trim() || undefined },
    })
    onClose()
  }

  const field = 'rounded-md border border-slate-300 bg-white px-2 py-1 text-sm'

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title={
          <>
            <span aria-hidden>{country?.flag}</span>
            Add a visit to {country?.name ?? a3}
          </>
        }
        onClose={onClose}
      />

      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Month
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className={field}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Year
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={field}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this visit…"
            rows={4}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <PhotosPlaceholder />

        <button
          onClick={save}
          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Add visit
        </button>
      </div>
    </Modal>
  )
}
