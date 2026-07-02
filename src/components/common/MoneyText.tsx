import { cn } from "@/lib/utils";

type Props = {
value: number;
className?: string;
currency?: string;
compact?: boolean;
};

export function formatMoney(value: number, currency = "kr", compact = false) {
const abs = Math.abs(value);
const formatted = compact && abs >= 1000
? new Intl.NumberFormat("en-US", {
notation: "compact",
maximumFractionDigits: 1,
}).format(value)
: new Intl.NumberFormat("en-US", {
maximumFractionDigits: 0,
}).format(value);
return `${formatted} ${currency}`;
}

export function MoneyText({ value, className, currency = "kr", compact }: Props) {
return (
<span className={cn("tabular-nums", className)}>
{formatMoney(value, currency, compact)}
</span>
);
}
