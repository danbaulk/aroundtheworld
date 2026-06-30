import { useState } from 'react'
import { TravelProvider } from './store'
import MapTab from './components/MapTab'
import PassportTab from './components/PassportTab'
import ChallengesTab from './components/ChallengesTab'

type Tab = 'map' | 'passport' | 'challenges'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'passport', label: 'Passport', icon: '📖' },
  { id: 'challenges', label: 'Challenges', icon: '🏅' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('map')

  return (
    <TravelProvider>
      <div className="flex h-dvh flex-col bg-slate-100">
        <header className="flex items-center justify-center border-b border-slate-200 bg-white py-2">
          <h1 className="text-base font-bold text-slate-800">🌍 Around the World</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">
          {tab === 'map' ? (
            <MapTab />
          ) : tab === 'passport' ? (
            <PassportTab />
          ) : (
            <ChallengesTab />
          )}
        </main>

        <nav className="grid grid-cols-3 border-t border-slate-200 bg-white">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition ${
                tab === t.id ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="text-lg" aria-hidden>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </TravelProvider>
  )
}
