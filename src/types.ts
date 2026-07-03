// Domain model for Around the World (schema v3: dated visits with notes + bucket list).

export type CountryStatus = 'visited' | 'bucketlist' // absence of an entry == unvisited

export type Visit = {
  id: string // crypto.randomUUID() — stable React key / edit target
  year: number // visit year
  month?: number // 1–12; optional (older visits predate the month picker)
  notes?: string // free-text; photos deferred (placeholder UI only, no field yet)
}

export type CountryEntry = {
  status: CountryStatus
  visits?: Visit[] // non-empty when status === 'visited'; absent for 'bucketlist'
  fromBucketList?: boolean // true when this visited country was on the bucket list (badge fuel)
}

export type TravelData = {
  version: 3 // schema version — bump + add a migration step in storage.ts on shape changes
  countries: Record<string, CountryEntry> // keyed by ISO alpha-3
}

export type Action =
  | { type: 'addVisit'; a3: string; visit: Visit }
  | { type: 'updateVisitNotes'; a3: string; visitId: string; notes: string }
  | { type: 'removeVisit'; a3: string; visitId: string }
  | { type: 'toggleBucketList'; a3: string }
