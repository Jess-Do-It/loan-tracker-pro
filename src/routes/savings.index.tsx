import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, PiggyBank } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { SavingsBucket } from "@/components/savings/SavingsBucket";
import { MoneyText } from "@/components/common/MoneyText";
import { useSavings } from "@/services/savingsService";

export const Route = createFileRoute("/savings/")({
head: () => ({ meta: [{ title: "Savings — Loan Tracker" }] }),
component: SavingsPage,
});

function SavingsPage() {
const goals = useSavings();
const total = goals.reduce((s, g) => s + g.currentAmount, 0);
const totalGoal = goals.reduce((s, g) => s + g.goalAmount, 0);

return (
<MobileShell title="Savings" subtitle="Goals & progress.">
<div className="space-y-4">
<div className="rounded-2xl bg-emerald-600 p-4 text-white shadow-sm">
<div className="text-[10px] uppercase tracking-wide opacity-80">
Total saved
</div>
<MoneyText value={total} className="text-2xl font-bold" />
<div className="mt-1 text-xs opacity-90">
of <MoneyText value={totalGoal} /> goal · {goals.length} buckets
</div>
</div>

<div className="flex items-center justify-between">
<span className="text-xs text-muted-foreground">
{goals.length} goals
</span>
<Link
to="/savings/add"
className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-secondary/80"
>
<Plus className="size-3.5" />
New goal
</Link>
</div>

{goals.length === 0 ? (
<div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
<div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary">
<PiggyBank className="size-6" />
</div>
<h3 className="mt-4 text-base font-semibold">No savings yet</h3>
<p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
Create a savings goal to start tracking progress.
</p>
</div>
) : (
<div className="space-y-3">
{goals.map((g) => (
<SavingsBucket key={g.id} goal={g} />
))}
</div>
)}
</div>
</MobileShell>
);
}
