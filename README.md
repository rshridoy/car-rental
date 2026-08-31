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

The AI assistant (see below) needs a `PROXY_SECRET` env var. Copy `.env.example` to
`.env.local` and fill in the real value (get it from the GCP project owner / secret manager —
never commit it). Without it, the chat widget and AI recommender still render but every request
fails with a 500.

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
| `/dashboard`   | Overview — date-range-filtered greeting bar & stat cards, best sellers (+ "View All" dialog), recent transactions (search/status filter/sort/pagination), sales analytics chart (year filter), sales-by-country map (period filter). Sidebar + topbar shell in `src/app/dashboard/layout.tsx`. |
| `/dashboard/products`, `/products/create`, `/products/expired`, `/products/low-stock` | Inventory — searchable/filterable/paginated product table (`ProductsTable`, backed by `/api/cars`), a real create form (POSTs to `/api/cars`), and expired/low-stock views (`stockFilter` on the same endpoint). |
| `/dashboard/category`, `/sub-category`, `/brands`, `/units`, `/variant-attributes`, `/warranties` | Reference/config tables. Category and Brands are **live-derived** from the product catalog (see Category/Brands below); the rest are static reference data — all searchable/sortable/paginated via the generic `DataTable`. |
| `/dashboard/print-barcode`, `/print-qr-code` | Pick a product, get a deterministic (not scannable) barcode/QR preview, and a real `window.print()` button. |
| `/dashboard/stock`, `/stock/adjustment`, `/stock/transfer` | Stock overview (reuses `ProductsTable`) plus adjustment/transfer forms that log to an in-session history table. |
| `/dashboard/sales`, `/invoices`, `/sales-return`, `/quotation` | Sales-side tables; Quotation also has a "Create Quotation" dialog that appends to its own table. |
| `/dashboard/pos` | A working point-of-sale: click a product to add to cart, adjust quantity, checkout clears the cart and shows a total. |
| `/dashboard/promo/codes`, `/promo/offers` | Promo codes (create dialog + active/paused toggle) and offer cards (toggle). |
| `/dashboard/super-admin` | Admin-user list + "Invite Admin" dialog. |
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
(`simulateLatency`), and return JSON via `jsonWithCache` (sets
`Cache-Control: private, max-age=30, stale-while-revalidate=60`, `src/lib/api.ts`).

`POST /api/cars` also exists (used by "Create Product" and the topbar "Add New" dialog) — it
appends a new car to the in-memory catalog and returns it with a 201.

`POST /api/ai/chat` is unrelated to the mock layer above — see AI assistant below.

## AI assistant

Two surfaces, one route, one backing model call:

- **Floating chat widget** (`src/components/ai/AIChatWidget.tsx`, mounted globally in
  `src/app/layout.tsx`) — "Alex", a general Q&A assistant available on every page.
- **AI Vehicle Recommender** (`src/components/ai/AIRecommendBar.tsx`, on `/cars` above the
  category tabs) — describe a trip in natural language and get 1–3 car IDs back, which highlight
  the matching `CarCard`s in the grid (`aiHighlighted` prop) with an amber "AI Pick" badge.

Both go through `POST /api/ai/chat` (`src/app/api/ai/chat/route.ts`), sharing the `useAIChat`
hook (`src/hooks/use-ai-chat.ts`) for conversation state. The request body is `{ mode: "chat" |
"recommend", messages: ChatMessage[] }`; `recommend` mode also returns a `recommendations:
{ carId, reason }[]` array, parsed out of a trailing JSON block the model is prompted to emit
and filtered against the real `CAR_DEALS` catalog before being trusted (`src/lib/ai/gemini.ts`).

The route calls a shared Vertex AI proxy (`src/lib/ai/gemini.ts`) rather than a model SDK
directly — it's a thin pass-through in front of Vertex's `generateContent` endpoint, authenticated
via the `PROXY_SECRET` header (see Setup above). The proxy doesn't support streaming, so replies
block until complete and the UI shows a typing indicator while waiting. Messages are capped at
2000 characters and history at 50 turns, both client- and server-side (`MAX_MESSAGE_LENGTH` in
the hook, mirrored in the route handler).

## A real gotcha worth knowing about: shared in-memory mock state

`CAR_DEALS` (`src/data/deals.ts`) is mutated at runtime (`createCar`, called from `POST
/api/cars`) so "Create Product" actually shows up elsewhere in the app. The first version of
this used a plain `export const CAR_DEALS = [...]` module-level array — and it **silently
didn't work**: Next.js can bundle each route (API routes, pages) as a separate module instance
in production, so `/dashboard/category` and `/dashboard/brands` (which call
`getCategorySummary()`/`getBrandSummary()` directly against `CAR_DEALS`) were reading a
different, never-mutated copy of the array than the one `/api/cars`'s `POST` handler mutated —
new products showed up in `/dashboard/products` (which goes through the API) but not in
Category/Brands counts (which read the array directly). Confirmed by comparing
`/api/cars?category=popular`'s `total` against the count rendered on `/dashboard/category` after
a `POST` — they diverged (23 vs. a frozen 20) on the very build where this was introduced.

Fixed by backing `CAR_DEALS` with `globalThis` instead of a plain module binding — the same
trick commonly used for Prisma-client singletons under Next.js dev HMR, applied here because
`globalThis` is the one thing guaranteed to be the same object across every bundle in a
process. If you add more admin data that needs both live mutation and to be read directly
(not through an API route) by a page, use the same pattern, or better, always read it through
the corresponding API route via `useApi` instead.

`/dashboard/category` and `/dashboard/brands` are also marked `export const dynamic =
"force-dynamic"` since they read this array directly during server rendering — without it,
Next would be free to statically prerender the page once at build time and freeze in
whatever `CAR_DEALS` looked like then.

## Caching

Two layers, both in `src/lib/api.ts` / `src/hooks/use-api.ts` — no external cache library:

1. **HTTP layer** — every API response sets a short `Cache-Control` header (30s, since the
   underlying data is static mock data that only changes when the code does). Lets the
   browser's own HTTP cache skip a repeat network round-trip for an identical request.
2. **Client layer** — `useApi` keeps a module-level, in-memory, stale-while-revalidate cache
   keyed by request URL. Revisiting a filter/tab/page you've already fetched (e.g. switching
   dashboard tabs, paging back on `/cars`) renders the cached result **immediately, with no
   loading skeleton**, while a fresh request still runs in the background and silently updates
   the view if the data changed. Verified with an end-to-end check that artificially stalls the
   network for 3s on revisit — cached content still rendered in ~250ms.

The cache resets on a full page reload (it's in-memory, not persisted) and isn't invalidated by
the mock mutations elsewhere in the app (wishlist, the "Add New" dialog) since those don't
write through this API layer.

## Structure

- `src/components/ui/` — shadcn/ui + Radix primitives (button, tabs, select, dialog, sheet,
  popover, table, pagination, card, badge, skeleton, tooltip, dropdown-menu, avatar,
  radio-group, input, label, sonner/toast) plus custom primitives: `ImagePlaceholder`
  (wireframe-style image glyph), `EmptyState`, and `Reveal` (scroll-in fade/slide, decorative
  only — no layout depends on JS running).
- `src/components/sections/`, `src/components/layout/` — landing page sections.
- `src/components/cars/` — `CarCard` (+ skeleton), `CarsListing` (the `/cars` page body),
  `BookingPanel`, `WishlistButton` — shared between the landing teaser and the `/cars*` routes.
- `src/components/dashboard/` — sidebar, topbar, dashboard overview panels, plus the generic
  `DataTable` (search + sort + pagination over any array) and `PageHeader` used by nearly every
  admin sub-page, and `ProductsTable`/`CategoryTable`/`BrandsTable` for the catalog-backed ones.
- `src/components/ai/` — `AIChatWidget` (floating chat bubble), `AIRecommendBar` (the `/cars`
  recommender), plus shared `ChatInput`/`ChatMessage` pieces. See AI assistant above.
- `src/data/` — typed mock data (`landing.ts`, `deals.ts`, `dashboard.ts`, `admin.ts`).
- `src/app/api/` — the mock API route handlers described above, plus `POST /api/ai/chat`
  (not mocked — a real call to the Vertex proxy, see AI assistant above).
- `src/hooks/` — `use-api` (fetch + loading/error state), `use-wishlist` (localStorage-backed,
  via `useSyncExternalStore` so it never hydration-mismatches), `use-ai-chat` (conversation state
  for both AI surfaces).
- `src/lib/ai/` — `gemini.ts` (Vertex proxy client, prompt building, recommendation parsing),
  `types.ts` (shared chat/recommendation types).

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
- **AI chat widget** (every page): real multi-turn conversation against the Vertex proxy, with
  quick-prompt chips, a typing indicator, and "Clear conversation". **AI Vehicle Recommender**
  (`/cars`): same backend, `recommend` mode — returned car IDs highlight the matching cards live.
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
- **Sidebar navigation**: every item now points at a real page (see route map above) and
  highlights based on the actual current path (`usePathname`), not a hardcoded flag. `Super
  Admin`, `Sales`, and `POS` were originally marked "expandable" (a `›` chevron, no real
  destination, per the prompt's own dashboard-frame description) — now that they have real
  pages, they're plain links like everything else and the unused expand/collapse code was
  removed.
- **"Coming Soon" topbar selector** is still a mock action (no corresponding dataset exists to
  switch); **"Add New"** and **POS** are real now — "Add New" `POST`s to `/api/cars`, and
  `/dashboard/pos` is a working cart/checkout flow (see route map).
- The ~20 sidebar pages beyond the Dashboard overview weren't specified beyond their nav label
  in the original prompt (only the overview screen was described in detail), so their content
  was my call: real, filterable/sortable/paginated tables (`DataTable`, a generic reusable
  component) over new mock datasets in `src/data/admin.ts`, reusing `/api/cars` wherever the
  data is genuinely the product catalog (Products, Expired, Low Stock, Manage Stock) rather
  than inventing a parallel dataset. Barcode/QR previews are deterministic-but-not-scannable
  (no barcode/QR library added for this); POS and Stock Adjustment/Transfer keep their own
  session-only state (not wired to a backend).
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
