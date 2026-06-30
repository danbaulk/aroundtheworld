# Around the World — Plan

_Last updated: 2026-06-30 · Status: Phases 1–3 built (local prototype runs)_

## What this is
Around the World is a local-first web app for tracking your worldwide travel progress. The
home screen is a world map of countries you "scratch off" by tapping the ones you've visited
(and flagging ones you want to go). It records when you went, so your trips build into a dated
passport and timeline. On top of the map sit encouragement mechanics — badges, predefined
challenges, and a random "dart throw" that nudges you toward somewhere new — plus a practical
per-country travel-tips assistant (currency, getting from the airport, SIM, scams, water, and
more). It's single-user, runs entirely in the browser with no backend, and stores everything
locally. Travel partners, deal alerts, leaderboards and other social/monetisation features are
intentionally out of scope for now.

## Feature groups
- **Map & progress** — world country map; tap to toggle visited; wishlist state; record visit
  date; versioned local persistence; progress stats (country count, % of world, continents).
- **Gamification** — dated passport book on a timeline; milestone badges; predefined
  auto-progress challenges; random dart throw at an unvisited country.
- **Travel tips / assistant** — contextual per-country info panel (currency, airport→city
  transfer & transport, common phrases, SIM, gov.uk advice, scams, vaccines, entry
  requirements, free ATMs, supermarkets/pharmacists, water, toilet); general trip-prep tools
  (packing checklist, airport timeline).
- **Deferred — travel partners** (productionise): shared maps showing where you've been together.
- **Deferred — monetisation:** deal alerts for unvisited places, events/festivals data
  (sponsored), limited-edition sponsored challenges, leaderboards, prize draws (win flights),
  loyalty rewards, usage-based airline discounts.

## Phases

### Phase 1 — The Scratch Map (simplest runnable slice)
**Goal:** Open the app, see a world map, tap countries to mark them visited (with the date) or
add them to a wishlist, and watch your progress stats update — all saved locally so it persists
across reloads.
**Includes:**
- World map rendered countries-only (use an existing SVG/geo dataset so the map is real
  without bespoke cartography).
- Tap a country to cycle/set its state: **unvisited → visited** (and a way to set **wishlist**).
- When marking visited, capture **when** (default to "now"/this year, editable).
- Versioned `localStorage` persistence in an isolated storage module (mirror pantry/gymbuddy:
  one typed state object, schema `version`, step migrations, re-seed fallback).
- Progress stats: countries visited count, **% of the world**, continents covered.
- App shell with a **tab bar** (Map / Passport / Challenges / Tips) — only **Map** is live;
  the others are placeholders.
- **Country dataset includes continent and region (sub-region) per country from day one**, so
  Phase 2 challenges/badges and stats can group by them without a data migration.
**Explicitly not yet:** passport book, badges, challenges, dart, any travel-tips content, the
scratch-off gesture animation.
**How we'll run & test it locally:** `npm run dev` → open localhost; tap several countries,
confirm stats update and the state survives a refresh. `npm run build` (tsc typecheck) +
`npm run lint` are the gates (no test runner required, per the pantry pattern).

### Phase 2 — Gamification
**Goal:** Turn the map into a rewarding loop — your visits become a dated passport, you earn
badges and progress on challenges automatically, and a dart throw suggests where to go next.
**Includes:**
- **Passport book** tab: one **dated stamp** per visited country, laid out on a **chronological
  timeline** (ordered by visit date).
- **Badges:** automatic milestone achievements (e.g. first country, 10/25/50 countries, all of
  a continent, all 7 continents) — derived from visited data, shown when earned.
- **Challenges:** a curated list of predefined goals (e.g. "Visit all 7 continents", "See 5
  Nordic countries") with **auto-progress** as you mark countries visited.
- **Random dart throw:** picks a random **unvisited** country and presents it as a suggestion.
**Explicitly not yet:** user-created challenges, sponsored/limited-edition challenges,
leaderboards, sharing.
**How we'll run & test it locally:** `npm run dev`; mark countries and confirm stamps appear on
the timeline in date order, badges unlock at thresholds, challenge progress fills, and the dart
only ever lands on unvisited countries.

### Phase 3 — Travel tips / assistant
**Goal:** Tapping a country, then a **Travel tips** button, opens a pop-up of useful, practical
per-country info.
**Includes:**
- Tap a country → its panel shows a **💡 Travel tips** button (alongside Visited/Wishlist/Clear).
- The button opens a **pop-up** populated from **static curated JSON** for ~5–10 seed countries.
  Fields per country: currency; airport→city transfer & public transport; common phrases / quick
  words; SIM situation; gov.uk travel advice (summary/link); common scams/gotchas; vaccines; entry
  requirements; free ATMs; tourist-friendly supermarkets/pharmacists; water situation; toilet
  situation.
- Graceful "no tips yet" state, shown in the pop-up for countries not in the seed set.
**Explicitly not yet:** live/AI-generated tips, external API integrations, full coverage of all
countries (start with a curated seed set).
**Dropped (decided 2026-06-30):** the general trip-prep tools — packing checklist and airport
timeline/countdown — and the dedicated Tips tab. Not useful enough to keep.
**How we'll run & test it locally:** `npm run dev`; tap a seeded country, open the tips pop-up and
confirm all fields show; tap an unseeded country and confirm the "no tips yet" pop-up state.

## Deferred to productionise
- **Travel partners** — adding partners and showing where you've travelled together (needs
  multi-user identity → first real reason for accounts/backend/sync).
- Real auth/accounts, hosting, a backend/database, cross-device sync, hardening, and choosing a
  formal production stack.

## Deferred to monetise
- Deal alerts on good prices for places you haven't been.
- Events/festivals happening in places (companies subscribe to that data to push deals).
- Limited-edition / sponsored challenges (governments, companies, event organisers).
- Leaderboards, prize draws (win free flights), loyalty-card-style rewards.
- Usage-based airline discounts (more you use the app, the better the discounts).

## Open questions
- _(resolved 2026-06-30)_ Phase 3 travel-tips seed set chosen: Japan, France, Thailand, USA,
  Spain, Italy, Australia, UAE, Mexico, Morocco (the "Recommended 10").

## Decisions log
- 2026-06-28 — Local-first web app (React + Vite + TS, `localStorage`), matching pantry/gymbuddy.
- 2026-06-28 — Countries-only map; tap-to-toggle (no scratch-gesture for now).
- 2026-06-28 — Two map states: visited + wishlist; record visit date.
- 2026-06-28 — Tips are contextual (country tap → panel), sourced from static curated JSON.
- 2026-06-28 — Phase order: Map → Gamification → Travel tips.
- 2026-06-28 — Dart picks unvisited countries only.
- 2026-06-28 — Challenges are predefined with auto-progress; badges are automatic milestones.
- 2026-06-28 — Passport is a book of dated stamps on a chronological timeline.
- 2026-06-28 — Map home + tab bar; Phase 1 ships only the Map tab.
- 2026-06-28 — Country dataset carries continent/region from Phase 1 to support later grouping.
- 2026-06-28 — Packing checklist + airport timeline are general tools, bundled into Phase 3.
- 2026-06-29 — **Phase 1 built and verified locally.** Stack: React 19 + Vite + TS, Tailwind v4,
  `localStorage`. Follows the gymbuddy shell pattern (pure reducer + context, bottom tab bar, no
  router) and pantry-style versioned storage with a step-migration scaffold.
- 2026-06-29 — Map renders with **react-simple-maps** (`ComposableMap` / `Geographies` /
  `Geography` / `ZoomableGroup`) fed the **world-atlas** TopoJSON (bundled as a same-origin asset);
  pan + zoom via `ZoomableGroup`. (First tried the React-19 fork `@vnedyalk0v/react19-simple-maps`,
  but its npm package is broken/bloated and ships a nested React copy → duplicate-React crash;
  reverted to the original react-simple-maps installed with `--legacy-peer-deps` + `resolve.dedupe`.)
- 2026-06-29 — Tap a country → a panel with **Visited / Wishlist / Clear** buttons and a **year**
  selector (defaults to the current year).
- 2026-06-29 — Country dataset is generated from the `world-countries` package into
  `src/data/countries.generated.ts` (a3, ISO-numeric id, name, 7-continent, subregion, flag); the
  "% of the world" denominator is the 194 UN-member countries.
- 2026-06-29 — A fresh scratch map starts **blank** (no demo seed), unlike pantry/gymbuddy.
- 2026-06-29 — **Phase 2 (Gamification) built and verified locally** on `feat/gamification`: dated
  passport timeline, milestone badges, curated challenges with auto-progress, and a map dart throw.
- 2026-06-29 — Badges, challenge progress, passport timeline and the dart pick are **pure
  derivations** over `state.countries` (`src/data/badges.ts`, `src/data/challenges.ts`,
  `src/selectors.ts`) — **no schema change**, `TravelData` stays `version: 1`.
- 2026-06-29 — Layout: **dart lives on the Map** (picks an unvisited country, reuses `CountryPanel`
  to wishlist it); **badges + challenges on the Challenges tab**; **Passport** is purely the dated
  stamp timeline, grouped by year (chronological).
- 2026-06-30 — **Phase 3 (Travel tips / assistant) built and verified locally** on
  `feat/travel-tips` (cut from `main` after PR #1 merged gamification).
- 2026-06-30 — Per-country tips are **static curated JSON** in `src/data/tips.ts`, keyed by `a3`
  (`getTips()`), for the Recommended 10; written from a **UK traveller's perspective** (gov.uk
  advice, British spelling).
- 2026-06-30 — Tips are surfaced via a **💡 Travel tips button** in `CountryPanel` that opens a
  **centred-card pop-up** (`src/components/CountryTips.tsx`) over a dimmed map; the button shows on
  **every** country and the pop-up shows a "no tips yet" state for unseeded ones. (Superseded the
  first cut, which rendered the tips inline in the panel.)
- 2026-06-30 — **Reversed the same day:** the packing checklist, airport timeline, and the
  dedicated **Tips tab** were dropped as not useful enough. The bottom nav is back to **3 tabs**
  (Map / Passport / Challenges). With no persisted non-country state, `TravelData` stays
  **`version: 1`** (the brief `packing` v2 slice was removed). `migrate()` only steps *forward*, so
  any leftover v2 blob from the abandoned build keeps its `countries` instead of resetting.
- 2026-06-30 — **Per-visit notes + multiple dated visits per country built and verified locally**
  on `feat/visit-notes`. This is the **first real schema bump: `version: 2`.** A `CountryEntry`
  now holds `visits: Visit[]` (each `{ id, year, notes? }`) instead of a single `visitedYear`, so a
  country can have **several dated visits**, each with its own free-text notes. `storage.ts`
  `migrateV1toV2` turns an old `visitedYear` into a one-element `visits` array (wishlist entries
  untouched). The **Passport** now shows **one stamp per visit** (not per country), and tapping a
  stamp — or a visit row in `CountryPanel` — opens `VisitNotes.tsx`, a centred-card pop-up (reusing
  the `CountryTips` pattern) with an editable notes textarea and a **photos placeholder** (📷 "coming
  soon" — no `photos` field persisted yet; that would be a future v3). New reducer actions
  `addVisit` / `updateVisitNotes` / `removeVisit` (removing the last visit deletes the entry →
  unvisited). Badges, challenges and progress stats still derive from `status` only, so they are
  unchanged (a country with two visits still counts once).
