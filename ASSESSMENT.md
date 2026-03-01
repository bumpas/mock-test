# Woven-Style Frontend Take‑Home Assessment

## 📦 Scenario
You are building a small internal tool for a mobility team at **Woven Fleet Services**. The tool helps operations analysts browse and evaluate a fleet of vehicles across multiple depots, identify maintenance risks, and compare candidates for deployment.

This is a **frontend‑only** take‑home. You will implement a single-page app using the provided Vite + React + TypeScript setup. Use mock data only.

---

## 🎯 Goals
Build a production‑quality UI that demonstrates:
- thoughtful UX
- clean component design
- predictable state management
- robust filtering/search
- excellent empty/error handling
- accessible and responsive layout

---

## ✅ Core Requirements

### 1) Fleet Overview (List Page)
Create a page that displays a list of vehicles with:
- Vehicle name, model year, depot
- Status badge (e.g., Available, In Maintenance, Reserved)
- Last service date
- Health score (0–100)

The list must support:
- **Search** by vehicle name or ID
- **Filter** by status, depot, health score range
- **Sort** by health score or last service date

### 2) Vehicle Details Drawer / Page
When a vehicle is selected, show a detailed view with:
- Full vehicle profile (all fields)
- Service history timeline
- Recent alerts

### 3) Compare Vehicles
Allow users to select up to **3 vehicles** and view a comparison table of key fields.

### 4) Favorites
Users can “star” vehicles and view only favorites.

---

## 📚 Data
Create a local mock data file (JSON or TS module) with **at least 25 vehicles** and realistic values. Include:
- `id`
- `name`
- `model`
- `year`
- `depot`
- `status`
- `healthScore`
- `lastServiceDate`
- `alerts` (array)
- `serviceHistory` (array)

---

## 🧰 Technical Constraints
- **React + TypeScript** only
- No backend — use local mock data
- No UI frameworks (MUI, Chakra, Ant) — write your own styles
- Use CSS modules, vanilla CSS, or styled components
- Keep app fully responsive
- Accessibility: keyboard navigation, focus states, and proper labels

---

## ✨ Bonus (Optional)
- Persist favorites to `localStorage`
- Add virtualization for large lists
- Provide a “Share view” URL with search/filter state encoded in query params
- Add basic unit tests (Vitest + React Testing Library)

---

## 🧪 Evaluation Criteria
We evaluate submissions like we would for a real candidate:
- **Code clarity** (components, hooks, and file structure)
- **State management** (predictable and testable)
- **UX polish** (details, spacing, empty states)
- **Performance** (filtering, rendering strategy)
- **Accessibility** (labels, focus, semantics)

---

## 🚀 How to Run
```zsh
npm install
npm run dev
```

---

## 📬 Submission Expectations
Your submission should include:
- working app in this repo
- clear README changes explaining any architectural decisions
- notes on tradeoffs or improvements you’d make with more time

Time expectations: **4–6 hours**. Focus on quality over completeness.
