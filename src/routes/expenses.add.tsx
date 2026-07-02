import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { recordExpense } from "@/services/expenseService";
import { dateInMonth } from "@/lib/dateHelpers";

const searchSchema = z.object({ month: z.string().optional() });

export const Route = createFileRoute("/expenses/add")({
validateSearch: (s) => searchSchema.parse(s),
head: () => ({ meta: [{ title: "Add Expense" }] }),
component: AddExpensePage,
});

function AddExpensePage() {
const navigate = useNavigate();
const { month } = useSearch({ from: "/expenses/add" });
const defaultDate = month ? dateInMonth(month, new Date().getDate()) : undefined;

return (
<div className="min-h-screen bg-background">
<div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
<Link
to="/"
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
>
<ChevronLeft className="size-4" /> Records
</Link>
<h1 className="mt-3 text-2xl font-bold tracking-tight">Add Expense</h1>
<p className="mt-1 text-sm text-muted-foreground">
Log a one-off purchase.
</p>
<div className="mt-6">
<ExpenseForm
submitLabel="Save Expense"
defaultDate={defaultDate}
onCancel={() => navigate({ to: "/" })}
onSubmit={(input, opts) => {
recordExpense(input, opts);
navigate({ to: "/" });
}}
/>
</div>
</div>
</div>
);
}
