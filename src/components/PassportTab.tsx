import { useEffect, useRef, useState } from 'react'
import { useTravel } from '../travelContext'
import { MONTHS, passportByYear } from '../selectors'
import { badgesByStamp, stampKey } from '../badgeStamps'
import VisitNotes from './VisitNotes'

type Props = {
  focus?: { a3: string; visitId: string } | null
  onFocusHandled?: () => void
}

// The passport book: one dated stamp per visit, laid out on a chronological timeline.
// Tap a stamp to open its notes & photos. A stamp that *earned* a badge shows the badge icon(s),
// and can be scrolled-to & briefly highlighted when arrived at from the Challenges tab.
export default function PassportTab({ focus = null, onFocusHandled }: Props) {
  const { state } = useTravel()
  const years = passportByYear(state)
  const bStamps = badgesByStamp(state)
  const stampCount = years.reduce((n, y) => n + y.stamps.length, 0)
  const [open, setOpen] = useState<{ a3: string; visitId: string } | null>(null)

  const focusRef = useRef<HTMLButtonElement | null>(null)
  const [highlight, setHighlight] = useState<string | null>(null)
  const focusKey = focus ? stampKey(focus.a3, focus.visitId) : null

  // Arrived from a "Go to the stamp" action: scroll it into view, flag it for highlight, and tell
  // the parent we've consumed the focus (so re-visiting the tab later doesn't re-scroll).
  useEffect(() => {
    if (!focusKey) return
    focusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlight(focusKey)
    onFocusHandled?.()
  }, [focusKey, onFocusHandled])

  // The highlight fades on its own timer, independent of the (already-cleared) focus.
  useEffect(() => {
    if (!highlight) return
    const t = setTimeout(() => setHighlight(null), 2200)
    return () => clearTimeout(t)
  }, [highlight])

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
              {stamps.map((s) => {
                const sKey = stampKey(s.a3, s.visitId)
                const earnedHere = bStamps.get(sKey)
                const isHi = highlight === sKey
                const isFocus = focus?.a3 === s.a3 && focus?.visitId === s.visitId
                return (
                  <button
                    key={s.visitId}
                    ref={isFocus ? focusRef : undefined}
                    onClick={() => setOpen({ a3: s.a3, visitId: s.visitId })}
                    className={`flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-left shadow-sm ring-1 transition ${
                      isHi ? 'ring-2 ring-amber-400' : 'ring-slate-200 hover:ring-sky-300'
                    }`}
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
                    {earnedHere && (
                      <span
                        className="ml-auto flex shrink-0 items-center gap-0.5 text-base"
                        aria-label={`Badges earned here: ${earnedHere.map((b) => b.label).join(', ')}`}
                      >
                        {earnedHere.map((b) => (
                          <span key={b.id} aria-hidden>
                            {b.icon}
                          </span>
                        ))}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {open && <VisitNotes a3={open.a3} visitId={open.visitId} onClose={() => setOpen(null)} />}
    </div>
  )
}
