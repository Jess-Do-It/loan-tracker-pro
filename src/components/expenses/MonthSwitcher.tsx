import { ChevronLeft, ChevronRight } from "lucide-react";
import { prettyMonth, shiftMonth } from "@/lib/dateHelpers";

export function MonthSwitcher({
value,
onChange,
}: {
value: string;
onChange: (next: string) => void;
}) {
return (
<div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-2 py-1.5 shadow-sm">
<button
type="button"
onClick={() => onChange(shiftMonth(value, -1))}
className="grid size-9 place-items-center rounded-full hover:bg-accent"
aria-label="Previous month"
>
<ChevronLeft className="size-5" />
</button>
<div className="text-sm font-semibold tabular-nums">
{prettyMonth(value)}
</div>
<button
type="button"
onClick={() => onChange(shiftMonth(value, 1))}
className="grid size-9 place-items-center rounded-full hover:bg-accent"
aria-label="Next month"
>
<ChevronRight className="size-5" />
</button>
</div>
);
}
