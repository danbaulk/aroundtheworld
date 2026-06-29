# Around the World — Plan

_Last updated: 2026-06-29 · Status: Phase 1 built (local prototype runs)_

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
**Goal:** Tapping a country opens a useful, practical info panel, and there are general
trip-prep tools to help you get to the airport prepared.
**Includes:**
- Tap a country → **info panel** populated from **static curated JSON** for ~5–10 seed
  countries. Fields per country: currency; airport→city transfer & public transport; common
  phrases / quick words; SIM situation; gov.uk travel advice (summary/link); common
  scams/gotchas; vaccines; entry requirements; free ATMs; tourist-friendly
  supermarkets/pharmacists; water situation; toilet situation.
- Graceful "no tips yet" state for countries not in the seed set.
- **General trip-prep tools** (not per-country): a **packing checklist** and an **airport
  timeline / countdown** with useful pre-flight info.
**Explicitly not yet:** live/AI-generated tips, external API integrations, full coverage of all
countries (start with a curated seed set).
**How we'll run & test it locally:** `npm run dev`; tap a seeded country and confirm its panel
shows all fields; tap an unseeded country and confirm the empty state; open the packing
checklist and airport-timeline tools.

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
- Which ~5–10 countries to seed travel tips for first (Phase 3) — pick at build time
  (suggest high-traffic destinations).

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
