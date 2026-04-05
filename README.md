# Atlas Finance Dashboard

A minimal, human-friendly finance dashboard with a calm fintech aesthetic (Stripe-inspired spacing, typography, and cards). It is a client-only React app suitable for demos and as a foundation for a real product.

## Features

- **Dashboard** — Summary cards; **interactive** balance line chart (brush zoom, hover cursor, animated line, zero reference when relevant); **interactive** category pie (hover/click highlight, legend buttons, detail strip); insights (highest category, month-over-month, tips).
- **Transactions** — Search; filters for type and **category**; **sort** by date or amount (asc/desc); optional **group by month**; **export** current result set as JSON or CSV.
- **Roles** — Toggle **Viewer** (read-only) vs **Admin** (add, edit, delete); role persisted locally.
- **Dark mode** — Theme toggle in the sidebar; persisted preference; charts adapt colors.
- **Mock API** — **Sync** button simulates a delayed `GET` that re-reads persisted data (pattern for wiring a real API later).
- **Persistence** — Transactions saved to `localStorage` (validated on load).
- **UX** — Empty states, motion on enter, hover elevation, responsive layout.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev and build
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Recharts](https://recharts.org/) for charts
- [React Router](https://reactrouter.com/) for pages

## Setup

```bash
cd finance-dashboard
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command         | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |

## Project structure

```
src/
  api/          # mockFinanceApi — delayed fetch reading the same store as the app
  components/   # Layout, charts, theme/sync controls, modal, etc.
  constants/    # storage keys
  pages/        # Dashboard and Transactions
  context/      # Provider, context, useFinance — data, filters, role, theme
  data/         # Seed transactions
  utils/        # Formatting, aggregations, export, storage helpers
  types/        # Shared TypeScript types
```

## Key decisions

- **Context API** — Transactions, role, theme, filters (including category/sort/group), and mock refresh live in one provider; still easy to split or add React Query later.
- **Tailwind v4 + `class` dark mode** — CSS variables swap under `.dark` on `<html>`; `@custom-variant dark` enables `dark:` utilities.
- **Interactive Recharts** — Brush on the line series; pie sectors + legend drive focus state; tooltips and animation durations tuned for feedback without noise.
- **Anchor month comparison** — “This month” vs “last month” uses the latest transaction date so the demo stays meaningful without a server clock.
- **Mock API** — `mockFetchTransactions` only adds latency and re-reads storage; it documents where a real HTTP client would plug in.

## License

Private / educational use — adjust as needed for your project.
