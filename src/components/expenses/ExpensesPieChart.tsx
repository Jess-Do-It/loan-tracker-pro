import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
PieChart,
Pie,
Cell,
ResponsiveContainer,
Tooltip,
} from "recharts";
import type { Expense } from "@/types/expense";
import { type ExpenseCategory } from "@/types/expense";
import { useCategoryMeta } from "@/services/categoryService";
import { formatMoney } from "@/components/common/MoneyText";

export function ExpensesPieChart({ records }: { records: Expense[] }) {
const navigate = useNavigate();
const categoryMeta = useCategoryMeta();
const { data, total } = useMemo(() => {
const map = new Map<ExpenseCategory, number>();
records.forEach((r) =>
map.set(r.category, (map.get(r.category) ?? 0) + r.amount),
);
const arr = Array.from(map.entries())
.map(([category, value]) => ({
category,
name: categoryMeta[category].label,
value,
color: categoryMeta[category].color,
}))
.sort((a, b) => b.value - a.value);
const total = arr.reduce((s, x) => s + x.value, 0);
return { data: arr, total };
}, [records, categoryMeta]);

if (total === 0) {
return (
<div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
No expenses recorded for this month yet.
</div>
);
}

return (
<div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
<div className="flex items-baseline justify-between">
<h3 className="text-sm font-semibold">Monthly expenses</h3>
<div className="text-right">
<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
Total
</div>
<div className="text-sm font-bold tabular-nums">
{formatMoney(total)}
</div>
</div>
</div>

<div className="h-52">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie
data={data}
dataKey="value"
nameKey="name"
innerRadius={45}
outerRadius={80}
paddingAngle={2}
>
{data.map((d) => (
<Cell
key={d.category}
fill={d.color}
className="cursor-pointer outline-none"
onClick={() =>
navigate({
to: "/charts/category/$category",
params: { category: d.category },
})
}
/>
))}
</Pie>
<Tooltip
formatter={(v: number) => formatMoney(v)}
contentStyle={{
borderRadius: 12,
border: "1px solid hsl(var(--border))",
fontSize: 12,
}}
/>
</PieChart>
</ResponsiveContainer>
</div>

<ul className="mt-2 space-y-1.5">
{data.map((d) => {
const pct = ((d.value / total) * 100).toFixed(1);
return (
<li key={d.category}>
<button
type="button"
onClick={() =>
navigate({
to: "/charts/category/$category",
params: { category: d.category },
})
}
className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-accent"
>
<span
className="size-2.5 shrink-0 rounded-full"
style={{ backgroundColor: d.color }}
/>
<span className="flex-1 truncate text-xs font-medium">
{d.name}
</span>
<span className="text-xs tabular-nums text-muted-foreground">
{pct}%
</span>
<span className="w-16 text-right text-xs font-semibold tabular-nums">
{formatMoney(d.value)}
</span>
</button>
</li>
);
})}
</ul>
</div>
);
}
