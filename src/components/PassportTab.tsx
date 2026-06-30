import { useTravel } from '../travelContext'
import { computeStats } from '../reducer'
import { passportByYear } from '../selectors'

// The passport book: one dated stamp per visited country, laid out on a chronological timeline.
export default function PassportTab() {
  const { state } = useTravel()
  const years = passportByYear(state)
  const { visitedCount } = computeStats(state)

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
        {visitedCount} {visitedCount === 1 ? 'stamp' : 'stamps'} in your passport
      </p>
      <div className="flex flex-col gap-5">
        {years.map(({ year, stamps }) => (
          <section key={year}>
            <h2 className="mb-2 text-sm font-bold text-slate-700">{year}</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {stamps.map((s) => (
                <div
                  key={s.a3}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200"
                >
                  <span className="text-2xl" aria-hidden>
                    {s.flag}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{s.name}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
