import { getCountry } from '../data/countries'
import { getTips } from '../data/tips'

type Props = {
  a3: string
  onClose: () => void
}

// One labelled tip row inside the popup body.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-100 pt-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-0.5 text-sm text-slate-700">{children}</div>
    </div>
  )
}

// A centred-card pop-up of travel tips for a country, opened from the Tips button in CountryPanel.
// Click the dimmed backdrop or the × to close. Shows a "no tips yet" state for unseeded countries.
export default function CountryTips({ a3, onClose }: Props) {
  const country = getCountry(a3)
  const tips = getTips(a3)

  return (
    <div
      onClick={onClose}
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
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-2 text-xl leading-none text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {tips ? (
          <div className="flex flex-col gap-3 overflow-y-auto p-4">
            <Field label="Currency">{tips.currency}</Field>
            <Field label="From the airport">{tips.airport}</Field>
            <Field label="Quick words">
              <ul className="flex flex-col gap-0.5">
                {tips.phrases.map((p) => (
                  <li key={p.en}>
                    <span className="text-slate-500">{p.en}:</span> {p.local}
                  </li>
                ))}
              </ul>
            </Field>
            <Field label="SIM / data">{tips.sim}</Field>
            <Field label="Tap water">{tips.water}</Field>
            <Field label="Toilets">{tips.toilets}</Field>
            <Field label="Getting cash">{tips.atms}</Field>
            <Field label="Shops & pharmacies">{tips.shops}</Field>
            <Field label="Entry (UK passport)">{tips.entry}</Field>
            <Field label="Vaccines">{tips.vaccines}</Field>
            <Field label="Common scams">
              <ul className="list-disc pl-4">
                {tips.scams.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Field>
            <Field label="gov.uk advice">
              {tips.govAdvice.summary}{' '}
              <a
                href={tips.govAdvice.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-sky-600 hover:underline"
              >
                Read the latest →
              </a>
            </Field>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            💡 No tips yet for {country?.name ?? 'this country'}.
          </div>
        )}
      </div>
    </div>
  )
}
