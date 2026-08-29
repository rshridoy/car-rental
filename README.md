# Best Auto

A car-rental product built from `figma/figmabuildprompt.md`: a public marketing/booking
website and an admin dashboard, sharing one design-token system and one mock API layer.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

No real backend — but there is a mock API layer (`src/app/api/**`, Next.js Route Handlers)
serving the typed data in `src/data/`. Every chart, table, and card fetches through it rather
than importing data files directly into components, so filters/pagination/sorting are real
request round-trips (with a small simulated network delay, see `src/lib/api.ts`) instead of
UI-only state.

## Route map

| Route          | Description                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `/`            | Landing page — nav, hero, functional booking search, how-it-works, popular deals (tabbed, real API data), why-choose-us, testimonials carousel, newsletter, footer. |
| `/cars`        | Full fleet listing — category tabs + location filter + pagination, all reflected in the URL (`?category=&location=&page=`), so it's shareable/bookmarkable. |
| `/cars/[id]`   | Car detail page — specs, description, wishlist toggle, and a mock booking panel ("Confirm Booking" shows a toast; nothing is persisted). |
| `/dashboard`   | Admin dashboard — date-range-filtered greeting bar & stat cards, best sellers (+ "View All" dialog), recent transactions (search/status filter/sort/pagination), sales analytics chart (year filter), sales-by-country map (period filter). Sidebar + topbar shell in `src/app/dashboard/layout.tsx`. |
| `/styleguide`  | Token palette, typography scale, and every component state.                                      |

## API routes

| Route                                | Query params                              |
| ------------------------------------- | ------------------------------------------ |
| `GET /api/cars`                       | `category`, `location`, `page`, `pageSize` |
| `GET /api/cars/[id]`                  | —                                           |
| `GET /api/dashboard/stats`            | `range` (`this-week`\|`last-week`\|`this-month`\|`last-month`) |
| `GET /api/dashboard/best-sellers`     | —                                           |
| `GET /api/dashboard/transactions`     | `status`, `q`, `sort`, `page`, `pageSize`   |
| `GET /api/dashboard/sales-analytics`  | `year`                                      |
| `GET /api/dashboard/sales-by-country` | `period` (`this-week`\|`this-month`\|`this-year`) |

All of them filter/sort/paginate the arrays in `src/data/`, add a ~350ms simulated delay
(`simulateLatency`), and return JSON. `src/hooks/use-api.ts` is the client-side fetch hook
every dashboard/cars component uses — it tracks loading/error state and aborts a stale
request if the params change before it resolves.

## Structure

- `src/components/ui/` — shadcn/ui + Radix primitives (button, tabs, select, dialog, sheet,
  popover, table, pagination, card, badge, skeleton, tooltip, dropdown-menu, avatar,
  radio-group, input, label, sonner/toast) plus custom primitives: `ImagePlaceholder`
  (wireframe-style image glyph), `EmptyState`, and `Reveal` (scroll-in fade/slide, decorative
  only — no layout depends on JS running).
- `src/components/sections/`, `src/components/layout/` — landing page sections.
- `src/components/cars/` — `CarCard` (+ skeleton), `CarsListing` (the `/cars` page body),
  `BookingPanel`, `WishlistButton` — shared between the landing teaser and the `/cars*` routes.
- `src/components/dashboard/` — sidebar, topbar, and dashboard panels.
- `src/data/` — typed mock data (`landing.ts`, `deals.ts`, `dashboard.ts`).
- `src/app/api/` — the mock API route handlers described above.
- `src/hooks/` — `use-api` (fetch + loading/error state), `use-wishlist` (localStorage-backed,
  via `useSyncExternalStore` so it never hydration-mismatches).

## Design tokens

Tokens live in `src/app/globals.css` under `:root`/`.dark` (raw values) and `@theme inline`
(Tailwind utility mapping) — Tailwind v4's CSS-first config, no `tailwind.config.ts`. Brand
tokens are grouped at the bottom of `:root` (`--primary`, `--navy`, `--success`, `--info`,
`--surface-muted`, `--page`, `--line-strong`) — re-skinning is a one-file edit. Wireframe greys
used by `ImagePlaceholder` are separate, generic Tailwind color utilities (not brand tokens)
since they exist to be replaced by real photography.

Font is Plus Jakarta Sans (`next/font/google`) via the `--font-sans` CSS variable.

## Functional interactions

- **Booking search** (landing hero): selecting a pick-up city and pressing Search navigates to
  `/cars?location=<city>` with real filtered results.
- **Wishlist**: the heart on any car card persists to `localStorage` and is shared across the
  landing teaser, `/cars`, and `/cars/[id]`.
- **`/cars`**: category tabs and the location filter both hit `/api/cars` and update the URL;
  pagination is real (8 per page).
- **Dashboard date range** (greeting bar): drives both the stat cards and the "48% increase…"
  copy via `/api/dashboard/stats`; the refresh button forces a re-fetch.
- **Recent Transactions**: search (debounced), status filter, amount sort, and pagination are
  all live against `/api/dashboard/transactions`.
- **Sales Analytics year** and **Sales by Countries period** selectors swap real datasets
  (`/api/dashboard/sales-analytics`, `/api/dashboard/sales-by-country`) — the map's highlighted
  region and pinned tooltip move accordingly.
- **"Add New"** (topbar) opens a mock product form; submitting shows a success toast (no
  persistence). **Mail/Bell** icons show mock notification lists in a dropdown.
- Loading states are real fetch-pending states (not simulated timers) — every data-driven panel
  renders a skeleton until its request resolves, and empty results render `EmptyState`.

## What I had to infer / assumptions

- **Sales-by-country map** uses a stylized inline SVG (soft continent blobs on a faint grid)
  instead of `react-simple-maps`, per the prompt's own fallback ("...or an inline SVG world
  map") — avoids a runtime fetch of remote topojson data. Decorative, not geographically
  precise; the highlighted blob and tooltip do move to match whichever region the period filter
  returns.
- **Sidebar responsive behavior**: collapses to an icon-only rail at the `lg` breakpoint
  unconditionally, and additionally accepts a manual collapse toggle once past `xl`. Below `lg`
  it becomes a Sheet drawer with full labels.
- **Expandable sidebar items** (`Super Admin`, `Sales`, `POS`) toggle a chevron on click but
  have no nested items — no submenu content was specified in the prompt.
- **"Coming Soon" topbar selector** and **POS button** are intentionally still mock actions
  (a toast on POS click) — no corresponding dataset exists to switch.
- **Popular car rental deals / `/cars` catalog**: the wireframe only shows content for
  "Popular" (8 identical placeholder cards, one featured) — those 8 are reproduced exactly for
  the landing teaser. Everything beyond that (12 more "popular" cars, all of "large"/"small")
  is an extended mock catalog with varied names/locations/specs, added so `/cars`' filters and
  pagination have real data. **"Exclusive Car" is left empty on purpose** to exercise the
  empty-state UI.
- **Testimonials carousel**: 3 visible cards but 4 pagination dots only reconciles as a sliding
  window of 3 over 6 slides (dots = total − visible + 1). Six identical placeholder testimonials
  were materialized to make the carousel mechanically real.
- **Booking search bar**: `Pick - Up`/`Drop - Off` is a real Radix `RadioGroup`; only the
  Pick-Up group's Locations field is wired to actual filtering (Date/Time stay decorative
  presets — there's no mock data dimension for them to filter). Both groups' fields stay
  visible side by side on desktop and collapse into two tabs below `lg`, per the prompt.
- **Dashboard date ranges / chart years / country periods** are a fixed set of presets
  (`this-week`/`last-week`/`this-month`/`last-month`, 2021–2024, `this-week`/`this-month`/
  `this-year`) with hand-authored mock datasets per option, rather than a real calendar picker
  — kept the interaction "real" (actual API round-trip, actual different numbers) without
  building full calendar UI the prompt didn't ask for.
- Copy typos in the source (`Rental Details`/`Rental Detials`, "Best Price Guarantted") were
  kept verbatim where specified; the nav's `Rental Detials` was corrected to `Rental Details`
  since the prompt's own heading for that item already uses the corrected spelling.
