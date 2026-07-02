import { useState } from "react";
import type { Expense, ExpenseInput, ExpenseCategory } from "@/types/expense";
import { useCategories } from "@/services/categoryService";
import { useLoans } from "@/services/loanService";
import { useSavings } from "@/services/savingsService";
import { CategoryIcon } from "@/components/expenses/CategoryIcon";
import { isoDate } from "@/lib/dateHelpers";

type Props = {
initial?: Expense;
defaultDate?: string;
submitLabel: string;
onSubmit: (input: ExpenseInput, opts: { recurring: boolean }) => void;
onCancel?: () => void;
};

export function ExpenseForm({
initial,
defaultDate,
submitLabel,
onSubmit,
onCancel,
}: Props) {
const [form, setForm] = useState<ExpenseInput>(() =>
initial
? {
name: initial.name,
amount: initial.amount,
category: initial.category,
date: initial.date,
note: initial.note,
sourceLoanId: initial.sourceLoanId,
sourceSavingsId: initial.sourceSavingsId,
}
: {
name: "",
amount: 0,
category: "grocery",
date: defaultDate ?? isoDate(new Date()),
},
);
const [errors, setErrors] = useState<Record<string, string>>({});
const [recurring, setRecurring] = useState(false);
const categories = useCategories();
const loans = useLoans().filter((l) => l.isActive);
const goals = useSavings();

function set<K extends keyof ExpenseInput>(k: K, v: ExpenseInput[K]) {
setForm((f) => ({ ...f, [k]: v }));
}

// Picking a category clears any target that no longer applies.
function selectCategory(c: ExpenseCategory) {
setForm((f) => ({
...f,
category: c,
sourceLoanId: c === "loan" ? f.sourceLoanId : undefined,
sourceSavingsId: c === "savings" ? f.sourceSavingsId : undefined,
}));
}

function handle(e: React.FormEvent) {
e.preventDefault();
const errs: Record<string, string> = {};
if (form.amount <= 0) errs.amount = "Must be greater than 0";
if (form.category === "loan" && form.sourceLoanId == null)
errs.sourceLoanId = "Pick a loan";
if (form.category === "savings" && form.sourceSavingsId == null)
errs.sourceSavingsId = "Pick a savings goal";
setErrors(errs);
if (Object.keys(errs).length) return;

// "What did you spend on?" is optional — fall back to a sensible label.
const loan = loans.find((l) => l.id === form.sourceLoanId);
const goal = goals.find((g) => g.id === form.sourceSavingsId);
let name = (form.name ?? "").trim();
if (!name) {
if (form.category === "loan" && loan) name = `${loan.name} payment`;
else if (form.category === "savings" && goal) name = `${goal.name} contribution`;
else name = categories.find((c) => c.key === form.category)?.label ?? "Expense";
}

onSubmit(
{
...form,
name,
sourceLoanId: form.category === "loan" ? form.sourceLoanId : undefined,
sourceSavingsId: form.category === "savings" ? form.sourceSavingsId : undefined,
},
{ recurring },
);
}

return (
<form onSubmit={handle} className="space-y-5">
{/* 1. Category */}
<div>
<div className="mb-2 text-xs font-medium text-muted-foreground">
Category
</div>
<div className="grid grid-cols-4 gap-2">
{categories.map((cat) => {
const c = cat.key;
const active = form.category === c;
return (
<button
key={c}
type="button"
onClick={() => selectCategory(c)}
className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition ${
active
? "border-primary bg-primary/5"
: "border-border/60 hover:bg-accent"
}`}
>
<CategoryIcon category={c} size="sm" />
<span className="text-[10px] font-medium">{cat.label}</span>
</button>
);
})}
</div>
</div>

{/* 2. Amount + Date */}
<div className="grid grid-cols-2 gap-3">
<Field label="Amount" error={errors.amount}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.amount === 0 ? "" : form.amount}
onChange={(e) => set("amount", Number(e.target.value))}
/>
</Field>
<Field label="Date">
<input
type="date"
className={inputCls}
value={form.date}
onChange={(e) => set("date", e.target.value)}
/>
</Field>
</div>

{/* 3. Target picker for loan / savings categories */}
{form.category === "loan" ? (
<Field label="Which loan?" error={errors.sourceLoanId}>
<select
className={inputCls}
value={form.sourceLoanId ?? ""}
onChange={(e) =>
set("sourceLoanId", e.target.value ? Number(e.target.value) : undefined)
}
>
<option value="">Select a loan…</option>
{loans.map((l) => (
<option key={l.id} value={l.id}>
{l.name}
</option>
))}
</select>
</Field>
) : null}

{form.category === "savings" ? (
<Field label="Which savings goal?" error={errors.sourceSavingsId}>
<select
className={inputCls}
value={form.sourceSavingsId ?? ""}
onChange={(e) =>
set(
"sourceSavingsId",
e.target.value ? Number(e.target.value) : undefined,
)
}
>
<option value="">Select a goal…</option>
{goals.map((g) => (
<option key={g.id} value={g.id}>
{g.name}
</option>
))}
</select>
</Field>
) : null}

{/* 4. Optional description — not shown for loan/savings (auto-named from target) */}
{form.category !== "loan" && form.category !== "savings" ? (
<Field label="What did you spend on? (optional)">
<input
className={inputCls}
placeholder="e.g. Groceries"
value={form.name}
onChange={(e) => set("name", e.target.value)}
/>
</Field>
) : null}

{/* 5. Optional note */}
<Field label="Note (optional)">
<textarea
className={`${inputCls} min-h-20`}
value={form.note ?? ""}
onChange={(e) => set("note", e.target.value)}
/>
</Field>

{/* Recurring toggle */}
<label className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
<input
type="checkbox"
className="size-4"
checked={recurring}
onChange={(e) => setRecurring(e.target.checked)}
/>
<span className="font-medium">Recurring</span>
<span className="text-xs text-muted-foreground">
Also add to monthly recurring
</span>
</label>

<div className="flex gap-2 pt-2">
{onCancel ? (
<button
type="button"
onClick={onCancel}
className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent"
>
Cancel
</button>
) : null}
<button
type="submit"
className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
>
{submitLabel}
</button>
</div>
</form>
);
}

const inputCls =
"h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({
label,
error,
children,
}: {
label: string;
error?: string;
children: React.ReactNode;
}) {
return (
<label className="block">
<span className="mb-1.5 block text-xs font-medium text-muted-foreground">
{label}
</span>
{children}
{error ? (
<span className="mt-1 block text-xs text-destructive">{error}</span>
) : null}
</label>
);
}
