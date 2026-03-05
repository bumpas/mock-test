# Woven Fleet Services

A single-page fleet management dashboard built with **React + TypeScript + Vite**. Operations analysts can browse a fleet of 25 vehicles across multiple depots, identify maintenance risks, and drill into service history — all from a filterable card grid with a slide-up detail drawer.

📄 **Assessment prompt:** [`ASSESSMENT.md`](ASSESSMENT.md)  
🎨 **Design reference:** [`pencil-design/simple-vehicle-status.pen`](pencil-design/simple-vehicle-status.pen)

---

## Quick Start

```zsh
npm install
npm run dev
```

## Scripts

```zsh
npm run build     # production build
npm run lint      # ESLint
npm run test      # Vitest unit tests
```

---

## What Was Built

### Core Requirements

| Requirement | Status | Notes |
|---|---|---|
| Fleet overview — name, model, year, depot, status, health, last service | ✅ | Responsive card grid, CSS custom property–driven health colour |
| Search by name or ID | ✅ | Case-insensitive, trims whitespace |
| Filter by status and depot | ✅ | Dropdowns auto-populated from data |
| Sort by health score or last service date | ✅ | 5 sort modes including name A–Z |
| Vehicle detail drawer | ✅ | Slide-up sheet, aria-modal, Escape/overlay close |
| Service history timeline | ✅ | Dot-connected list, date parsed from `"YYYY-MM-DD: description"` format |
| Recent alerts | ✅ | Shown in drawer and previewed on card |
| Favorites — star/unstar | ✅ | Persisted to `localStorage` |
| Filter to favorites only | ✅ | Toggle in toolbar |

### Bonus

| Bonus | Status | Notes |
|---|---|---|
| Persist favorites to `localStorage` | ✅ | Hydrated on load with validation |
| Unit tests | ✅ | Vitest — `filterAndSortVehicles` covered |
| Compare vehicles | ❌ | Descoped — see tradeoffs |
| Virtualization | ❌ | Not needed at 25 vehicles |
| Share-view URL encoding | ❌ | Descoped |

---

## Architecture

### Component Structure

```
src/
├── tokens.css                  # Design tokens (:root custom properties)
├── index.css                   # CSS layers: base, components, utilities
├── App.tsx                     # Root state, filtering, keyboard navigation
├── components/
│   ├── card/
│   │   ├── Card.tsx            # Vehicle card — health ring, badges, favorite toggle
│   │   └── card.module.css
│   ├── drawer/
│   │   ├── Drawer.tsx          # Slide-up detail sheet — alerts + service history
│   │   └── Drawer.module.css
│   └── toolbar/
│       ├── Toolbar.tsx         # Search, filter dropdowns, sort, favorites toggle
│       └── Toolbar.module.css
├── data/
│   └── vehicles.json           # 25 mock vehicles with realistic values
└── utils/
    ├── vehicleFilters.ts       # Pure filter + sort function
    └── vehicleFilters.test.ts  # Vitest unit tests
```

### State Management

All state lives in `App.tsx` — no context or external store. The data flow is deliberately simple:

- `baseVehicles` — raw JSON cast to `Vehicle[]`, memoized once
- `vehicleList` — base vehicles merged with live `favoriteIds` Set (so favorites don't require mutating source data)
- `filteredVehicles` — derived via `filterAndSortVehicles()`, a pure function that's easy to test in isolation

`favoriteIds` is stored as a `Set<string>` rather than a boolean on each vehicle object, which avoids mutating the data layer and makes the `localStorage` serialization explicit.

### Styling

- **CSS Modules** for all component styles — scoped by default, no class name collisions
- **`tokens.css`** — extracted `:root` block matching the Pencil design file's variable names (`--color-status-available`, `--shadow-drawer`, etc.)
- **`@layer base, components, utilities`** in `index.css` — explicit cascade order that gives component-level CSS Module rules priority over globals without relying on specificity hacks
- No UI frameworks — all styles are handwritten

### Accessibility

- Card grid items use `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space activate)
- Drawer uses `role="dialog"` + `aria-modal="true"` + `aria-label`
- Keyboard navigation with arrow keys cycles through cards when a drawer is open; Escape closes it
- Health score ring has `aria-label="Health: X%"` and the decorative span is `aria-hidden`
- Empty state uses `role="status"` + `aria-live="polite"`
- Focus states on all interactive elements via `focus-visible`

---

## Tradeoffs & Improvements

**Compare vehicles was descoped.** Implementing a multi-select comparison table properly — with clear entry/exit UX, accessible table markup, and a sensible keyboard model that doesn't conflict with the existing drawer — would have taken another hour and risked degrading the quality of the core experience. Given "quality over completeness" guidance it was cut.

**No `<header>` landmark.** The `h1` sits inside `.container` rather than a `<header>` element. For a real product this should be a proper sticky `<header>` with a `<nav>` — matching the design file's `Header` frame — but scope was kept to the card/drawer flow.

**Service history parsing is fragile.** History entries are stored as `"YYYY-MM-DD: description"` strings. This works for the mock data but a real API would return structured objects `{ date, description }`. The parsing is isolated to `Drawer.tsx` so it's easy to replace.

**Tests are minimal.** `vehicleFilters.ts` has coverage for sort and favorites filter; edge cases (empty dataset, unknown sort key, whitespace-only search) and component-level rendering tests (React Testing Library) would be the next additions.

**No error boundary.** A malformed vehicle object (e.g. missing `alerts` array) would throw at render time. An `ErrorBoundary` wrapping the card grid with a graceful fallback would harden this for production.

