import { useState } from "react";
import type { Expense, ExpenseInput, ExpenseCategory } from "@/types/expense";
import { CATEGORY_LIST, CATEGORY_META } from "@/types/expense";
import { CategoryIcon } from "./CategoryIcon";
import { isoDate } from "@/lib/dateHelpers";

type Props = {
initial?: Expense;
defaultDate?: string;
submitLabel: string;
onSubmit: (input: ExpenseInput) => void;
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
}
: {
name: "",
amount: 0,
category: "grocery",
date: defaultDate ?? isoDate(new Date()),
},
);
const [errors, setErrors] = useState<Record<string, string>>({});

function set<K extends keyof ExpenseInput>(k: K, v: ExpenseInput[K]) {
setForm((f) => ({ ...f, [k]: v }));
}

function handle(e: React.FormEvent) {
e.preventDefault();
const errs: Record<string, string> = {};
if (!form.name.trim()) errs.name = "Name is required";
if (form.amount <= 0) errs.amount = "Must be greater than 0";
setErrors(errs);
if (Object.keys(errs).length) return;
onSubmit({ ...form, name: form.name.trim() });
}

return (
<form onSubmit={handle} className="space-y-5">
<Field label="What did you spend on?" error={errors.name}>
<input
className={inputCls}
placeholder="e.g. Groceries"
value={form.name}
onChange={(e) => set("name", e.target.value)}
/>
</Field>

<div className="grid grid-cols-2 gap-3">
<Field label="Amount" error={errors.amount}>
<input
type="number"
inputMode="decimal"
className={inputCls}
value={form.amount}
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

<div>
<div className="mb-2 text-xs font-medium text-muted-foreground">
Category
</div>
<div className="grid grid-cols-4 gap-2">
{CATEGORY_LIST.filter((c) => c !== "loan").map((c) => {
const active = form.category === c;
return (
<button
key={c}
type="button"
onClick={() => set("category", c as ExpenseCategory)}
className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition ${
active
? "border-primary bg-primary/5"
: "border-border/60 hover:bg-accent"
}`}
>
<CategoryIcon category={c} size="sm" />
<span className="text-[10px] font-medium">
{CATEGORY_META[c].label}
</span>
</button>
);
})}
</div>
</div>

<Field label="Note (optional)">
<textarea
className={`${inputCls} min-h-20`}
value={form.note ?? ""}
onChange={(e) => set("note", e.target.value)}
/>
</Field>

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
