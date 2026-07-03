import type { Badge } from '../data/badges'
import type { PassportStamp } from '../selectors'
import { formatVisitDate } from '../selectors'
import Modal, { ModalHeader } from './Modal'

type Props = {
  badge: Badge
  contributing: PassportStamp[]
  earning: PassportStamp
  onGoToStamp: (a3: string, visitId: string) => void
  onClose: () => void
}

// A centred-card pop-up detailing which passport stamps earned a badge, opened by tapping an earned
// badge on the Challenges tab. Mirrors the VisitNotes overlay pattern. The stamp that clinched the
// badge (the last one chronologically) is marked; tapping any row — or the primary button — jumps
// to that stamp on the Passport tab.
export default function BadgeDetail({ badge, contributing, earning, onGoToStamp, onClose }: Props) {
  const go = (a3: string, visitId: string) => {
    onGoToStamp(a3, visitId)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title={
          <>
            <span className="text-2xl" aria-hidden>
              {badge.icon}
            </span>
            {badge.label}
          </>
        }
        subtitle={badge.description}
        onClose={onClose}
      />

      <div className="flex flex-col gap-3 overflow-y-auto p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Earned by {contributing.length === 1 ? 'this stamp' : 'these stamps'}
        </p>
        <ul className="flex flex-col gap-1.5">
          {contributing.map((s) => {
            const isEarner = s.a3 === earning.a3 && s.visitId === earning.visitId
            return (
              <li key={`${s.a3}:${s.visitId}`}>
                <button
                  onClick={() => go(s.a3, s.visitId)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left ring-1 transition ${
                    isEarner
                      ? 'bg-amber-50 ring-amber-300 hover:ring-amber-400'
                      : 'bg-white ring-slate-200 hover:ring-sky-300'
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {s.flag}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-slate-700">
                    {s.name}
                    <span className="font-normal text-slate-400"> · {formatVisitDate(s)}</span>
                  </span>
                  {isEarner && (
                    <span className="shrink-0 text-xs font-semibold text-amber-600" title="Earned it">
                      ★ earned it
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <button
          onClick={() => go(earning.a3, earning.visitId)}
          className="mt-1 self-stretch rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Go to the stamp →
        </button>
      </div>
    </Modal>
  )
}
