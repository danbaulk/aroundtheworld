import { useState } from 'react'
import { useTravel } from '../travelContext'
import { MONTHS, passportByYear } from '../selectors'
import VisitNotes from './VisitNotes'

// The passport book: one dated stamp per visit, laid out on a chronological timeline.
// Tap a stamp to open its notes & photos.
export default function PassportTab() {
  const { state } = useTravel()
  const years = passportByYear(state)
  const stampCount = years.reduce((n, y) => n + y.stamps.length, 0)
  const [open, setOpen] = useState<{ a3: string; visitId: string } | null>(null)

  if (years.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
        <p className="text-lg font-semibold text-slate-700">📖 Your passport is empty</p>
        <p className="text-sm">No stamps yet — mark a country visited on the Map.</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-3">
      <p className="mb-3 text-sm text-slate-500">
        {stampCount} {stampCount === 1 ? 'stamp' : 'stamps'} in your passport
      </p>
      <div className="flex flex-col gap-5">
        {years.map(({ year, stamps }) => (
          <section key={year}>
            <h2 className="mb-2 text-sm font-bold text-slate-700">{year}</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {stamps.map((s) => (
                <button
                  key={s.visitId}
                  onClick={() => setOpen({ a3: s.a3, visitId: s.visitId })}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-sky-300"
                >
                  <span className="text-2xl" aria-hidden>
                    {s.flag}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {s.name}
                    {s.month && MONTHS[s.month] && (
                      <span className="font-normal text-slate-400"> ({MONTHS[s.month]})</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && <VisitNotes a3={open.a3} visitId={open.visitId} onClose={() => setOpen(null)} />}
    </div>
  )
}
