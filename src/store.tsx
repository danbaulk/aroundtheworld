import { useEffect, useReducer } from 'react'
import type { ReactNode } from 'react'
import { travelReducer } from './reducer'
import { load, save } from './storage'
import { TravelContext } from './travelContext'

export function TravelProvider({ children }: { children: ReactNode }) {
  // Lazily seed the reducer from localStorage on first render.
  const [state, dispatch] = useReducer(travelReducer, undefined, load)

  // Persist on every change.
  useEffect(() => {
    save(state)
  }, [state])

  return <TravelContext.Provider value={{ state, dispatch }}>{children}</TravelContext.Provider>
}
