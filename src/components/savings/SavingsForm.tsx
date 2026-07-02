import { useState } from "react";
import type { SavingsGoal, SavingsGoalInput } from "@/types/savings";

type Props = {
initial?: SavingsGoal;
submitLabel: string;
onSubmit: (input: SavingsGoalInput) => void;
onCancel?: () => void;
};

export function SavingsForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
const [form, setForm] = useState<SavingsGoalInput>(() =>
initial
? { ...initial }
: {
name: "",
goalAmount: 0,
currentAmount: 0,
targetDate: "",
monthlyContribution: 0,
},
);
const [errors, setErrors] = useState<Record<string, string>>({});

function set<K extends keyof SavingsGoalInput>(k: K, v: SavingsGoalInput[K]) {
setForm((f) => ({ ...f, [k]: v }));
}

function handle(e: React.FormEvent) {
e.preventDefault();
const errs: Record<string, string> = {};
if (!form.name.trim()) errs.name = "Name is required";
if (form.goalAmount <= 0) errs.goalAmount = "Must be > 0";
if (form.currentAmount < 0) errs.currentAmount = "Cannot be negative";
setErrors(errs);
if (Object.keys(errs).length) return;
onSubmit({ ...form, name: form.name.trim() });
}

return (
<form onSubmit={handle} className="space-y-5">
<Field label="Goal name" error={errors.name}>
<input
className={inputCls}
placeholder="e.g. Emergency fund"
value={form.name}
onChange={(e) => set("name", e.target.value)}
/>
</Field>

<div className="grid grid-cols-2 gap-3">
<Field label="Goal amount" error={errors.goalAmount}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.goalAmount === 0 ? "" : form.goalAmount}
onChange={(e) => set("goalAmount", Number(e.target.value))}
/>
</Field>
<Field label="Saved so far" error={errors.currentAmount}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.currentAmount === 0 ? "" : form.currentAmount}
onChange={(e) => set("currentAmount", Number(e.target.value))}
/>
</Field>
<Field label="Target date">
<input
type="date"
className={inputCls}
value={form.targetDate ?? ""}
onChange={(e) => set("targetDate", e.target.value)}
/>
</Field>
<Field label="Monthly contribution">
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.monthlyContribution === 0 ? "" : form.monthlyContribution}
onChange={(e) => set("monthlyContribution", Number(e.target.value))}
/>
</Field>
</div>

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
