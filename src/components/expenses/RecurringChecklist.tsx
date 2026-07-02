import { useEffect, useRef, useState } from "react";
import { useLoans } from "@/services/loanService";
import {
useRecurring,
isRecurringRecorded,
isLoanRecorded,
toggleRecurringRecorded,
toggleLoanRecorded,
useExpenses,
} from "@/services/expenseService";
import { CategoryIcon } from "@/components/expenses/CategoryIcon";
import { MoneyText } from "@/components/common/MoneyText";
import { Checkbox } from "@/components/ui/checkbox";

const REMOVE_DELAY_MS = 350;

export function RecurringChecklist({ monthK }: { monthK: string }) {
useExpenses();
const recurring = useRecurring();
const loans = useLoans().filter((l) => l.isActive);

// Local optimistic checked state -> commits to service after a short delay
// so the user sees the check animation before the row disappears.
const [pending, setPending] = useState<Set<string>>(new Set());
const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

useEffect(() => {
return () => {
timers.current.forEach((t) => clearTimeout(t));
timers.current.clear();
};
}, []);

const scheduleCommit = (key: string, commit: () => void) => {
setPending((prev) => {
const next = new Set(prev);
next.add(key);
return next;
});
const existing = timers.current.get(key);
if (existing) clearTimeout(existing);
const t = setTimeout(() => {
commit();
timers.current.delete(key);
setPending((prev) => {
const next = new Set(prev);
next.delete(key);
return next;
});
}, REMOVE_DELAY_MS);
timers.current.set(key, t);
};

const items = [
...loans.map((l) => {
const key = `loan-${l.id}`;
return {
key,
name: `${l.name} EMI`,
amount: l.monthlyPayment,
category: "loan" as const,
recorded: isLoanRecorded(l.id, monthK),
sub: l.lender,
onCheck: () =>
scheduleCommit(key, () =>
toggleLoanRecorded(l.id, l.name, l.monthlyPayment, monthK, l.dueDay ?? 1, true),
),
};
}),
...recurring.map((r) => {
const key = `rec-${r.id}`;
return {
key,
name: r.name,
amount: r.amount,
category: r.category,
recorded: isRecurringRecorded(r.id, monthK),
sub: `Day ${r.dayOfMonth}`,
onCheck: () =>
scheduleCommit(key, () => toggleRecurringRecorded(r.id, monthK, true)),
};
}),
].filter((i) => !i.recorded);

if (items.length === 0) return null;

return (
<section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
<div className="mb-3 flex items-center justify-between">
<div>
<h3 className="text-sm font-semibold">Recurring this month</h3>
<p className="text-xs text-muted-foreground">
Tick to add as a payment
</p>
</div>
<span className="text-xs text-muted-foreground tabular-nums">
{items.length} left
</span>
</div>
<ul className="divide-y divide-border/60">
{items.map((it) => {
const isPending = pending.has(it.key);
return (
<li
key={it.key}
className={`flex items-center gap-3 py-2.5 transition-all duration-300 ${
isPending ? "opacity-40 -translate-x-1" : "opacity-100"
}`}
>
<Checkbox
checked={isPending}
disabled={isPending}
onCheckedChange={(v) => {
if (Boolean(v)) it.onCheck();
}}
className="size-5 rounded"
/>
<CategoryIcon category={it.category} size="sm" />
<div className="min-w-0 flex-1">
<div
className={`truncate text-sm font-medium ${
isPending ? "line-through" : ""
}`}
>
{it.name}
</div>
{it.sub ? (
<div className="truncate text-xs text-muted-foreground">
{it.sub}
</div>
) : null}
</div>
<MoneyText
value={it.amount}
className="text-sm font-semibold"
/>
</li>
);
})}
</ul>
</section>
);
}
