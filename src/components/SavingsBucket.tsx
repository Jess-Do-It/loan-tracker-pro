import { Check } from "lucide-react";
import type { SavingsGoal } from "@/types/savings";
import { MoneyText } from "./MoneyText";

export function SavingsBucket({ goal }: { goal: SavingsGoal }) {
const pct = Math.min(100, (goal.currentAmount / goal.goalAmount) * 100);
const complete = pct >= 100;
const color = goal.color ?? "#10b981";

return (
<div
className={`rounded-2xl border p-4 shadow-sm transition ${
complete
? "border-emerald-300 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30"
: "border-border/60 bg-card"
}`}
>
<div className="flex items-center justify-between gap-2">
<div className="min-w-0">
<div className="flex items-center gap-2">
<h3 className="truncate text-sm font-semibold">{goal.name}</h3>
{complete ? (
<span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white">
<Check className="size-3" strokeWidth={3} />
</span>
) : null}
</div>
{goal.targetDate ? (
<div className="mt-0.5 text-[11px] text-muted-foreground">
Target {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
{goal.monthlyContribution
? ` · +${goal.monthlyContribution.toLocaleString()} kr/mo`
: ""}
</div>
) : null}
</div>
<div className="text-right">
<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
{pct.toFixed(0)}%
</div>
</div>
</div>

<div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
<div
className="h-full rounded-full transition-all"
style={{
width: `${pct}%`,
background: complete ? "#10b981" : color,
}}
/>
</div>

<div className="mt-2 flex items-baseline justify-between text-xs">
<MoneyText value={goal.currentAmount} className="font-semibold" />
<span className="text-muted-foreground">
of <MoneyText value={goal.goalAmount} />
</span>
</div>
</div>
);
}
