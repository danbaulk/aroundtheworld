# Around the World

A local-first travel scratch-map: tap the countries you've visited, build a dated passport of
your trips, and earn badges as your map fills in. Single-user, runs entirely in the browser
with no backend or accounts - everything is stored in `localStorage`.

## Features

- **Scratch map** - a pannable/zoomable world map with country name labels; tap a country to
  log dated visits (month + year + notes) or add it to your bucket list.
- **Progress stats** - countries visited, % of the world (out of the 194 UN members), and
  continents covered.
- **Passport** - one stamp per visit on a vertical chronological timeline; tap a stamp for its
  notes.
- **Badges & challenges** - automatic milestone badges (each linked back to the passport stamp
  that earned it) and curated challenges with auto-progress.
- **Dart throw** - picks a random unvisited country to nudge you somewhere new.
- **Travel tips** - a per-country pop-up of practical info (currency, airport transfer, SIM,
  scams, water and more) for a curated seed set of 10 countries, written from a UK traveller's
  perspective.

## Stack

React 19 + Vite + TypeScript, Tailwind CSS v4, react-simple-maps (world-atlas TopoJSON).
No router - the app is a three-tab shell (Map / Passport / Challenges).

## Running it

```bash
npm install --legacy-peer-deps   # react-simple-maps has a React <19 peer range
npm run dev            # dev server
npm run build          # tsc type-check + vite build - the main verification gate
npm run lint           # oxlint
npm run gen:countries  # regenerate src/data/countries.generated.ts from world-countries
```

There is no test runner; `npm run build` and `npm run lint` are the gates.

## Data

State is one typed `TravelData` object persisted to `localStorage` under
`aroundtheworld:data`, with a schema version (currently v3) and forward-only step migrations
in `src/storage.ts`.

See `aroundtheworld/PROJECT_PLAN.md` in the private `danbaulk/docs` repo for scope, phasing and
the decisions log, and `CLAUDE.md` for the architecture guide.
