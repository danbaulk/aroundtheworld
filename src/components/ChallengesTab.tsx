import { useTravel } from '../travelContext'
import { BADGES, earnedBadges } from '../data/badges'
import { CHALLENGES, isComplete } from '../data/challenges'
import type { TravelData } from '../types'

function BadgeGrid({ state }: { state: TravelData }) {
  const earned = new Set(earnedBadges(state).map((b) => b.id))
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold text-slate-700">Badges</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BADGES.map((b) => {
          const got = earned.has(b.id)
          return (
            <div
              key={b.id}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-center ring-1 transition ${
                got ? 'bg-white ring-green-500' : 'bg-slate-50 opacity-60 ring-slate-200'
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {b.icon}
              </span>
              <span className={`text-sm font-semibold ${got ? 'text-green-700' : 'text-slate-600'}`}>
                {b.label}
              </span>
              <span className="text-xs text-slate-500">{b.description}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ChallengeList({ state }: { state: TravelData }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold text-slate-700">Challenges</h2>
      <div className="flex flex-col gap-2">
        {CHALLENGES.map((c) => {
          const p = c.progress(state)
          const done = isComplete(p)
          const pct = Math.min(100, Math.round((p.current / p.target) * 100))
          return (
            <div key={c.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  {done ? '✓ ' : ''}
                  {c.label}
                </span>
                <span className="text-xs tabular-nums text-slate-500">
                  {Math.min(p.current, p.target)}/{p.target}
                </span>
              </div>
              <p className="mb-2 text-xs text-slate-500">{c.description}</p>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-[width] ${done ? 'bg-green-600' : 'bg-sky-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Gamification tab: derived milestone badges + curated challenges with auto-progress.
export default function ChallengesTab() {
  const { state } = useTravel()
  return (
    <div className="h-full overflow-y-auto p-3">
      <div className="flex flex-col gap-5">
        <BadgeGrid state={state} />
        <ChallengeList state={state} />
      </div>
    </div>
  )
}
