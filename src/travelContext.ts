import { createContext, useContext } from 'react'
import type { Dispatch } from 'react'
import type { Action, TravelData } from './types'

// Split out from store.tsx so the react/only-export-components lint rule isn't tripped by
// exporting a hook + context alongside the provider component (as gymbuddy/src/gymContext.ts).
export type TravelContextValue = {
  state: TravelData
  dispatch: Dispatch<Action>
}

export const TravelContext = createContext<TravelContextValue | null>(null)

export function useTravel(): TravelContextValue {
  const ctx = useContext(TravelContext)
  if (!ctx) throw new Error('useTravel must be used within a TravelProvider')
  return ctx
}
