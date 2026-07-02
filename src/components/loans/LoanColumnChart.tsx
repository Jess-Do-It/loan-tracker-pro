import { useState } from "react";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
Legend,
} from "recharts";
import type { Loan } from "@/types/loan";
import { formatMoney } from "@/components/common/MoneyText";

type View = "monthly" | "split" | "paid";

export function LoanColumnChart({ loans }: { loans: Loan[] }) {
const [view, setView] = useState<View>("monthly");

if (loans.length === 0) {
return (
<div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
No active loans.
</div>
);
}

const data = loans.map((l) => {
const totalPaid = Math.max(0, l.totalPayable - l.currentBalance - l.totalInterest);
return {
name: l.name.length > 10 ? l.name.slice(0, 9) + "…" : l.name,
monthly: l.monthlyPayment,
principal: l.currentBalance,
interest: l.totalInterest,
paid: totalPaid,
remaining: l.currentBalance,
};
});

return (
<div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
<div className="flex items-center justify-between gap-2">
<h3 className="text-sm font-semibold">Loans</h3>
</div>
<div className="mt-2 flex gap-1 overflow-x-auto pb-1">
<ViewBtn active={view === "monthly"} onClick={() => setView("monthly")}>
Monthly
</ViewBtn>
<ViewBtn active={view === "split"} onClick={() => setView("split")}>
Principal + Interest
</ViewBtn>
<ViewBtn active={view === "paid"} onClick={() => setView("paid")}>
Paid vs Principal
</ViewBtn>
</div>

<div className="mt-3 h-64">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={data} margin={{ left: -10, right: 0, top: 10, bottom: 0 }}>
<XAxis
dataKey="name"
tick={{ fontSize: 10 }}
interval={0}
angle={-20}
textAnchor="end"
height={50}
/>
<YAxis
tick={{ fontSize: 10 }}
tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
/>
<Tooltip
formatter={(v: number) => formatMoney(v)}
contentStyle={{
borderRadius: 12,
border: "1px solid hsl(var(--border))",
fontSize: 12,
}}
/>
{view !== "monthly" && <Legend wrapperStyle={{ fontSize: 11 }} />}

{view === "monthly" && (
<Bar dataKey="monthly" name="Monthly" fill="#6366f1" radius={[6, 6, 0, 0]} />
)}
{view === "split" && (
<Bar dataKey="principal" name="Principal" stackId="a" fill="#6366f1" />
)}
{view === "split" && (
<Bar dataKey="interest" name="Interest" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
)}
{view === "paid" && (
<Bar dataKey="paid" name="Paid" stackId="b" fill="#10b981" />
)}
{view === "paid" && (
<Bar dataKey="remaining" name="Remaining" stackId="b" fill="#64748b" radius={[6, 6, 0, 0]} />
)}

</BarChart>
</ResponsiveContainer>
</div>
</div>
);
}

function ViewBtn({
active,
children,
onClick,
}: {
active: boolean;
children: React.ReactNode;
onClick: () => void;
}) {
return (
<button
type="button"
onClick={onClick}
className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
active
? "bg-primary text-primary-foreground"
: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
}`}
>
{children}
</button>
);
}
