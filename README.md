# Best Auto

A car-rental product built from `figma/figmabuildprompt.md`: a public marketing/booking
landing page and an admin dashboard, sharing one design-token system.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

No backend, no environment variables. Every list, card, table row and chart series lives in
typed mock data under `src/data/`.

## Route map

| Route         | Description                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| `/`           | Public landing page — nav, hero, booking search, how-it-works, popular deals (tabbed, filterable), why-choose-us, testimonials carousel, footer. |
| `/dashboard`  | Admin dashboard — greeting bar, stat cards, best sellers, recent transactions, sales analytics chart, sales-by-country map. Sidebar + topbar shell in `src/app/dashboard/layout.tsx`. |
| `/styleguide` | Token palette, typography scale, and every component state (buttons, badges, tabs, form controls, skeletons, empty state, cards). |

## Structure

- `src/components/ui/` — shadcn/ui + Radix primitives (button, tabs, select, dialog/sheet, table, card, badge, skeleton, tooltip, dropdown-menu, avatar, radio-group, input) plus two custom primitives: `ImagePlaceholder` (wireframe-style image glyph, `solid`/`subtle` variants) and `EmptyState`.
- `src/components/sections/`, `src/components/layout/` — landing page sections.
- `src/components/dashboard/` — sidebar, topbar, and dashboard panels.
- `src/data/` — typed mock data (`landing.ts`, `deals.ts`, `dashboard.ts`).
- `src/hooks/use-delayed-ready.ts` — simulates fetch latency so data-driven panels have a real loading → loaded transition to skeleton.

## Design tokens

Tokens live in `src/app/globals.css` under `:root`/`.dark` (raw values) and `@theme inline`
(Tailwind utility mapping), Tailwind v4's CSS-first config — there is no `tailwind.config.ts`
in this project, so that's where token edits belong. Brand tokens are grouped at the bottom of
`:root` (`--primary`, `--navy`, `--success`, `--info`, `--surface-muted`, `--page`,
`--line-strong`) — re-skinning is a one-file edit. Wireframe greys used by `ImagePlaceholder`
are separate, generic Tailwind color utilities (not brand tokens) since they exist to be
replaced by real photography.

Font is Plus Jakarta Sans (`next/font/google`) via the `--font-sans` CSS variable, per the
"geometric sans, tight-tracked bold headings" spec.

## What I had to infer

The build prompt describes the dashboard and map widget in prose rather than deriving them
from a Figma frame, so several implementation details were my call:

- **Sales-by-country map** uses a stylized inline SVG (soft continent blobs on a faint grid,
  Africa highlighted) instead of `react-simple-maps`, per the prompt's own fallback ("...or an
  inline SVG world map"). This avoids a runtime fetch of remote topojson data. It's decorative
  and not geographically precise.
- **Sidebar responsive behavior**: a persistent column collapses to an icon-only rail at the
  `lg` breakpoint unconditionally, and additionally accepts a manual collapse toggle (the
  topbar's chevron chip) once past `xl`, where there's room for the choice to matter. Below
  `lg` it becomes a Sheet drawer with full labels (opened from the topbar hamburger).
- **Expandable sidebar items** (`Super Admin`, `Sales`, `POS` — marked with `›` in the prompt)
  toggle a chevron on click but have no nested items, since no submenu content was specified.
- **"Coming Soon" selector and the chart's "2023" chip** are visually functional dropdowns/chips
  but don't change the underlying mock data (there's only one dataset to show).
- **Popular car rental deals**: the design/prompt only gives content for the "Popular" tab (8
  cards, one featured). "Large Car" and "Small Car" reuse the same placeholder card at
  different prices so the tab filter has real data to switch on. **"Exclusive Car" is left
  empty on purpose** to exercise the required empty-state UI.
- **Testimonials carousel**: the source shows 3 visible cards but 4 pagination dots, which
  only reconciles as a sliding window of 3 over a longer list (dots = total − visible + 1 = 4
  ⇒ 6 underlying slides). Six identical placeholder testimonials were materialized to make the
  carousel mechanically real; a production build would swap in unique quotes.
- **"Promo" sidebar group** was left in the prompt as "leave it extensible" with no items
  listed — two representative items (Promo Codes, Offers) were added so the group renders.
- **Booking search bar**: `Pick - Up`/`Drop - Off` is a real Radix `RadioGroup` for a11y
  semantics; on desktop both groups' fields stay visible side by side (matching the wireframe),
  and only collapse into two tabs below `lg` as the prompt specifies for mobile.
- Copy typos in the source (`Rental Details`/`Rental Detials` inconsistency in the prompt,
  "Best Price Guarantted") were kept verbatim where the prompt said to; `Rental Detials` in the
  nav was corrected to `Rental Details` since the prompt itself uses the corrected spelling in
  its own heading for that item and only the earlier nav-copy line had the typo.
