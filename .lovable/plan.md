## Restructure: 5-tab finance tracker

Reorganize the bottom nav around five sections and add expenses + savings alongside the existing loans system. All mock-data + placeholder services, no backend.

### New bottom nav (5 tabs)

```
Records | Charts | [ + ] | Loans | Savings
```

The center `+` opens an **action sheet** with three buttons: **Expense**, **Loan**, **Savings goal** (replaces the current "always-add-loan" plus).

### 1. Records (month-by-month)

- Month switcher at the top (`< November 2026 >`).
- **Recurring checklist card**: list of recurring items for that month (active loan EMIs + fixed expenses like rent, subscriptions). Each row has a checkbox; checking it inserts a payment record for that month. Unchecking removes it.
- **Payment records list** below, grouped by day. Each record shows a **category icon** (loan, grocery, transport, entertainment, bills, dining, other), name, amount.
- Tap `+` (top-right) → opens Add Expense form prefilled to that month.

### 2. Charts (month-by-month, scrollable)

Month switcher at top. Three stacked sections:

- **Expenses** — Pie chart of total monthly spend split by category (loans counted as one slice + each expense category). Legend shows % per slice. Tapping a slice navigates to a **category drilldown** screen with a month-by-month bar chart of spend in that category over the last 6 months.
- **Loans** — Column chart with a small button row at the top to switch view:
- Monthly payment per loan
- Principal vs interest per loan (stacked)
- Total paid vs total principal per loan (grouped)
- **Savings** — One "bucket" bar per goal: filled portion = saved, full bar = goal, with amount + % label. if its full, make it green with a tick on it.

### 3. Loans (tab)

- Header summary: **Debt-free in `X yr Y mo**`, **Total monthly payments**, **Total payable**.
- List of loan cards (existing `LoanCard`), tap → existing detail/edit screens.

### 4. Savings (tab, new)

- Header summary: **Total amount saved**.
- One card per goal with a horizontal bar (saved vs goal), target date, monthly contribution.
- Tap card → goal detail (simple read-only screen for now).

### 5. Add flows

- `/add` (action sheet route) → three buttons.
- `/expenses/add` — name, amount, category (icon picker), date, recurring toggle.
- `/loans/add` — existing.
- `/savings/add` — name, goal amount, current amount, target date, monthly contribution.

### Technical layout

add a chart library to visualise diff charts

**New types** (`src/types/`):

- `expense.ts` — `Expense`, `ExpenseCategory` enum + `CATEGORY_META` (icon, label, color).
- `savings.ts` — `SavingsGoal`.
- `record.ts` — unified `PaymentRecord` view-model (used by Records list).

**New mock data**:

- `src/lib/mockExpenses.ts`, `src/lib/mockSavings.ts`, `src/lib/mockRecurring.ts` (recurring fixed expenses separate from one-off records).

**New services** (same `useSyncExternalStore` pattern as `loanService`):

- `src/services/expenseService.ts` — CRUD + `getRecordsForMonth(yyyymm)`, `getRecurringForMonth`, `toggleRecurringRecorded`.
- `src/services/savingsService.ts` — CRUD + `getTotalSaved`.

**New calc helpers** (`src/lib/`):

- `expenseCalculations.ts` — category totals, monthly series per category.
- `savingsCalculations.ts` — progress %, total saved.
- `dateHelpers.ts` — month key (`YYYY-MM`), pretty label, prev/next.

**New components**:

- `MonthSwitcher.tsx`
- `CategoryIcon.tsx` (maps category → lucide icon + tint)
- `RecurringChecklist.tsx`
- `PaymentRecordRow.tsx`
- `PieChartExpenses.tsx` (SVG, no chart lib)
- `LoanColumnChart.tsx` (reuses existing bar primitives, adds view toggle)
- `SavingsBucket.tsx`
- `AddActionSheet.tsx`
- `ExpenseForm.tsx`, `SavingsForm.tsx`

**New / changed routes**:

- `src/routes/index.tsx` → becomes **Records** page (replaces Overview).
- `src/routes/charts.tsx` → rewritten with three sections + month switcher.
- `src/routes/charts.category.$category.tsx` → drilldown.
- `src/routes/loans.index.tsx` → add summary header.
- `src/routes/savings.index.tsx` → new.
- `src/routes/savings.add.tsx`, `src/routes/savings.$goalId.tsx` → new.
- `src/routes/expenses.add.tsx` → new.
- `src/routes/add.tsx` → action sheet route (center nav button).
- `src/components/BottomNav.tsx` → relabel/reorder tabs, point `+` at `/add`.

**Out of scope** (still mock / placeholder): real persistence, real recurring-payment generation engine,

### What gets removed

- The current "Overview" summary-cards page (the same numbers live on the Loans tab summary + Charts page).
- The "More" placeholder slot in the bottom nav.
