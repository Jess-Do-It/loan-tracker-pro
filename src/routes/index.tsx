import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { MonthSwitcher } from "@/components/expenses/MonthSwitcher";
import { RecurringChecklist } from "@/components/expenses/RecurringChecklist";
import { PaymentRecordRow } from "@/components/expenses/PaymentRecordRow";
import { MoneyText } from "@/components/common/MoneyText";
import { useExpenses } from "@/services/expenseService";
import { currentMonthKey, formatDay } from "@/lib/dateHelpers";

export const Route = createFileRoute("/")({
head: () => ({ meta: [{ title: "Records — Loan Tracker" }] }),
component: RecordsPage,
});

function RecordsPage() {
const [month, setMonth] = useState(currentMonthKey());
const allExpenses = useExpenses();

const records = useMemo(
() =>
allExpenses
.filter((e) => e.date.startsWith(month))
.sort((a, b) => (a.date < b.date ? 1 : -1)),
[allExpenses, month],
);

const total = records.reduce((s, r) => s + r.amount, 0);

const grouped = useMemo(() => {
const map = new Map<string, typeof records>();
records.forEach((r) => {
const k = r.date;
if (!map.has(k)) map.set(k, []);
map.get(k)!.push(r);
});
return Array.from(map.entries());
}, [records]);

return (
<MobileShell title="Records" subtitle="Track every payment this month.">
<div className="space-y-4">
<MonthSwitcher value={month} onChange={setMonth} />

<div className="flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
<div>
<div className="text-[10px] uppercase tracking-wide opacity-80">
Total spent
</div>
<MoneyText value={total} className="text-2xl font-bold" />
</div>
<div className="text-right text-xs opacity-90">
<div>{records.length} records</div>
</div>
</div>

<RecurringChecklist monthK={month} />

<section className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
<div className="flex items-center justify-between px-2 pb-2 pt-1">
<h3 className="text-sm font-semibold">Payments</h3>
<Link
to="/expenses/add"
search={{ month }}
className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold hover:bg-secondary/80"
>
<Plus className="size-3.5" /> Add
</Link>
</div>
{records.length === 0 ? (
<div className="px-2 py-8 text-center text-sm text-muted-foreground">
No payments yet for this month.
</div>
) : (
<div className="space-y-3">
{grouped.map(([day, items]) => (
<div key={day}>
<div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
{formatDay(day)}
</div>
<div>
{items.map((r) => (
<PaymentRecordRow key={r.id} record={r} />
))}
</div>
</div>
))}
</div>
)}
</section>
</div>
</MobileShell>
);
}
