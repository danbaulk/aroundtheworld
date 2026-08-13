# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server (check at phone-width - the layout is mobile-first)
npm run build          # tsc -b type-check, then vite build - the main verification gate
npm run lint           # oxlint over the repo
npm run gen:countries  # regenerate src/data/countries.generated.ts from the world-countries package
```

There is **no test runner** (deliberate, per the pantry pattern): `npm run build` and
`npm run lint` are the gates. Install with `--legacy-peer-deps` - react-simple-maps declares a
React <19 peer range (see the decisions log for the history). `prop-types` must stay a direct
dependency even though `src/` never imports it: react-simple-maps requires it and removing the
top-level entry drops it from the tree and breaks the build.

## Architecture

Around the World is a single-user, local-first travel scratch-map: React 19 + Vite +
TypeScript, Tailwind CSS v4, no router, no backend. Persistence is `localStorage` only.
British spelling throughout the UI copy.

### State flow

All app state lives in one `TravelData` object (`src/types.ts`, schema v3) driven through a
single reducer. The layering mirrors gymbuddy and is worth preserving:

- **`src/reducer.ts`** - pure, framework-free. Every domain mutation (`Action` union:
  `addVisit` / `updateVisitNotes` / `removeVisit` / `toggleBucketList`) plus `statusOf` and
  `computeStats`. Keep it free of React imports.
- **`src/storage.ts`** - the only file that touches `localStorage`
  (`STORAGE_KEY = 'aroundtheworld:data'`). Owns the schema version and **forward-only step
  migrations** (v1 -> v2 -> v3); a blob with an unknown/newer version keeps its `countries` and
  is re-stamped rather than reset. A fresh map starts blank - no demo seed. Bump
  `CURRENT_VERSION` and add a `step()` case for any breaking shape change.
- **`src/store.tsx`** - `TravelProvider`: `useReducer(travelReducer, undefined, load)` plus an
  effect that saves on every change.
- **`src/travelContext.ts`** - `TravelContext` + `useTravel()`. Split from `store.tsx` so the
  react-refresh lint rule isn't tripped; don't merge them back. Components read/dispatch via
  `useTravel()` and never touch storage directly.

`src/App.tsx` is the whole shell: a three-tab toggle (`map` / `passport` / `challenges`) in
local `useState`, no router. It also holds the cross-tab "focus this passport stamp" handoff
used when jumping from a badge to the stamp that earned it.

### Domain invariants

- A country entry is either `status: 'visited'` with a non-empty `visits: Visit[]` (each
  `{ id, year, month?, notes? }`, id = `crypto.randomUUID()`), or `status: 'bucketlist'` with
  no visits. Removing the last visit deletes the entry (visited <=> at least one visit).
- `fromBucketList` is set when a visit is logged for a bucket-listed country and carried across
  later visits - it powers the "Bucket list" badge. The reducer guards `toggleBucketList` so a
  stray dispatch can never wipe a visited country.
- **Everything gamified is derived, never persisted**: passport timeline and stamps
  (`src/selectors.ts`), badges (`src/data/badges.ts`), challenges (`src/data/challenges.ts`),
  badge -> earning-stamp links (`src/badgeStamps.ts`), and the dart throw all recompute from
  `state.countries`. A country with several visits still counts once. Derivation passes compute
  `computeStats` / acquisition stamps once and thread them through - keep that shape.
- The "% of the world" denominator is the **194 UN members** (`counts` flag on each country);
  synthetic territories (Kosovo etc, world-atlas id "-99") are tappable but don't count.

### Map & data

- The map is react-simple-maps fed the world-atlas TopoJSON, bundled as a same-origin asset.
  Country name labels (`src/mapLabels.ts` + `CountryLabels.tsx`) appear in zoom tiers, placed
  at the largest polygon's centroid.
- `src/data/countries.generated.ts` is **generated** - edit `scripts/gen-countries.mjs` and
  re-run `npm run gen:countries`, never hand-edit it. It carries continent/subregion per
  country so grouping never needs a data migration.
- Per-country travel tips are static curated JSON in `src/data/tips.ts` (10 seed countries,
  UK-traveller perspective); unseeded countries get a "no tips yet" pop-up state.
- All pop-ups (tips, visit notes, add-visit, badge detail, confirm) compose the shared
  `src/components/Modal.tsx` shell; `ConfirmDialog` uses its `topmost` variant to stack over a
  parent overlay.

## Project plan

The plan is the source of truth for scope, phasing, rejected ideas and the decisions log - read it
before starting new feature work. It lives in the private
[`danbaulk/docs`](https://github.com/danbaulk/docs) repo at `aroundtheworld/PROJECT_PLAN.md`
(clone it alongside this one as `~/dev/docs`). The prototype is complete: Phases
1-3 (map, gamification, travel tips) plus post-phase polish (multiple dated visits with notes,
bucket list, badge-stamp links, map labels, vertical passport timeline). Travel partners,
accounts/backend/sync and monetisation features are explicitly deferred to future
productionise/monetise passes.
