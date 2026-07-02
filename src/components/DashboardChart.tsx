import { MoneyText } from "./MoneyText";

type Item = { label: string; value: number };

type Props = {
title: string;
subtitle?: string;
items: Item[];
barClassName?: string;
};

export function DashboardChart({
title,
subtitle,
items,
barClassName = "bg-primary",
}: Props) {
const max = Math.max(...items.map((i) => i.value), 1);
return (
<div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
<h3 className="text-sm font-semibold">{title}</h3>
{subtitle ? (
<p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
) : null}
<ul className="mt-4 space-y-3">
{items.map((item) => {
const pct = (item.value / max) * 100;
return (
<li key={item.label}>
<div className="flex items-center justify-between text-xs">
<span className="truncate font-medium">{item.label}</span>
<MoneyText
value={item.value}
className="text-muted-foreground"
/>
</div>
<div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
<div
className={`h-full rounded-full ${barClassName}`}
style={{ width: `${pct}%` }}
/>
</div>
</li>
);
})}
</ul>
</div>
);
}
