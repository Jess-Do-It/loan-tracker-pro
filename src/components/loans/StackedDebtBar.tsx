import { MoneyText } from "./MoneyText";

type Props = {
principal: number;
interest: number;
fees: number;
};

export function StackedDebtBar({ principal, interest, fees }: Props) {
const total = Math.max(principal + interest + fees, 1);
const p = (principal / total) * 100;
const i = (interest / total) * 100;
const f = (fees / total) * 100;

return (
<div className="space-y-4">
<div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
<div
className="h-full bg-sky-500 transition-all"
style={{ width: `${p}%` }}
title={`Principal ${p.toFixed(1)}%`}
/>
<div
className="h-full bg-amber-500 transition-all"
style={{ width: `${i}%` }}
title={`Interest ${i.toFixed(1)}%`}
/>
<div
className="h-full bg-rose-500 transition-all"
style={{ width: `${f}%` }}
title={`Fees ${f.toFixed(1)}%`}
/>
</div>

<ul className="space-y-2 text-sm">
<Row color="bg-sky-500" label="Principal" value={principal} pct={p} />
<Row color="bg-amber-500" label="Interest" value={interest} pct={i} />
<Row color="bg-rose-500" label="Fees" value={fees} pct={f} />
</ul>
</div>
);
}

function Row({
color,
label,
value,
pct,
}: {
color: string;
label: string;
value: number;
pct: number;
}) {
return (
<li className="flex items-center justify-between gap-3">
<div className="flex min-w-0 items-center gap-2">
<span className={`size-3 shrink-0 rounded-full ${color}`} />
<span className="truncate text-muted-foreground">{label}</span>
</div>
<div className="flex items-center gap-3 tabular-nums">
<MoneyText value={value} className="font-medium" />
<span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
</div>
</li>
);
}
