import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
label: string;
value: ReactNode;
hint?: ReactNode;
accent?: "default" | "primary" | "warning" | "success";
className?: string;
};

const accentStyles: Record<NonNullable<Props["accent"]>, string> = {
default: "bg-card",
primary: "bg-primary text-primary-foreground",
warning: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
success: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
};

export function SummaryCard({ label, value, hint, accent = "default", className }: Props) {
return (
<div
className={cn(
"rounded-2xl border border-border/60 p-4 shadow-sm",
accentStyles[accent],
className,
)}
>
<div className="text-xs font-medium uppercase tracking-wide opacity-70">
{label}
</div>
<div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
{hint ? <div className="mt-1 text-xs opacity-70">{hint}</div> : null}
</div>
);
}
