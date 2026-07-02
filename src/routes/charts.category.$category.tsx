import { useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
} from "recharts";
import { CATEGORY_META, type ExpenseCategory } from "@/types/expense";
import { useExpenses } from "@/services/expenseService";
import { lastNMonths, shortMonth } from "@/lib/dateHelpers";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatMoney } from "@/components/MoneyText";

export const Route = createFileRoute("/charts/category/$category")({
head: () => ({ meta: [{ title: "Category — Charts" }] }),
component: CategoryDrilldownPage,
});

function CategoryDrilldownPage() {
const { category } = useParams({ from: "/charts/category/$category" });
const cat = category as ExpenseCategory;
const meta = CATEGORY_META[cat];
const expenses = useExpenses();

const data = useMemo(() => {
const months = lastNMonths(6);
return months.map((m) => ({
month: shortMonth(m),
value: expenses
.filter((e) => e.category === cat && e.date.startsWith(m))
.reduce((s, e) => s + e.amount, 0),
}));
}, [expenses, cat]);

const total = data.reduce((s, d) => s + d.value, 0);
const avg = total / data.length;

return (
<div className="min-h-screen bg-background">
<div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
<Link
to="/charts"
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
>
<ChevronLeft className="size-4" />
Charts
</Link>
<div className="mt-4 flex items-center gap-3">
<CategoryIcon category={cat} size="lg" />
<div>
<h1 className="text-2xl font-bold tracking-tight">{meta.label}</h1>
<p className="text-sm text-muted-foreground">Last 6 months</p>
</div>
</div>

<div className="mt-5 grid grid-cols-2 gap-3">
<div className="rounded-2xl border border-border/60 bg-card p-3">
<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
6-mo total
</div>
<div className="mt-1 text-lg font-semibold tabular-nums">
{formatMoney(total)}
</div>
</div>
<div className="rounded-2xl border border-border/60 bg-card p-3">
<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
Avg / month
</div>
<div className="mt-1 text-lg font-semibold tabular-nums">
{formatMoney(Math.round(avg))}
</div>
</div>
</div>

<div className="mt-4 rounded-2xl border border-border/60 bg-card p-4">
<h3 className="text-sm font-semibold">Month by month</h3>
<div className="mt-3 h-64">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={data} margin={{ left: -10, right: 0, top: 10, bottom: 0 }}>
<XAxis dataKey="month" tick={{ fontSize: 11 }} />
<YAxis
tick={{ fontSize: 10 }}
tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
/>
<Tooltip
formatter={(v: number) => formatMoney(v)}
contentStyle={{ borderRadius: 12, fontSize: 12 }}
/>
<Bar dataKey="value" fill={meta.color} radius={[6, 6, 0, 0]} />
</BarChart>
</ResponsiveContainer>
</div>
</div>
</div>
</div>
);
}
