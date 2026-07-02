import { Trash2 } from "lucide-react";
import type { Expense } from "@/types/expense";
import { CategoryIcon } from "./CategoryIcon";
import { MoneyText } from "./MoneyText";
import { formatDay } from "@/lib/dateHelpers";
import { deleteExpense } from "@/services/expenseService";

export function PaymentRecordRow({ record }: { record: Expense }) {
return (
<div className="group flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-accent/40">
<CategoryIcon category={record.category} />
<div className="min-w-0 flex-1">
<div className="truncate text-sm font-medium">{record.name}</div>
<div className="truncate text-xs text-muted-foreground">
{formatDay(record.date)}
</div>
</div>
<MoneyText value={record.amount} className="text-sm font-semibold" />
<button
type="button"
onClick={() => deleteExpense(record.id)}
className="grid size-8 place-items-center rounded-full text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
aria-label="Delete record"
>
<Trash2 className="size-4" />
</button>
</div>
);
}
