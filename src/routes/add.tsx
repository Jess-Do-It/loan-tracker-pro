import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Receipt, Wallet, PiggyBank } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ExpenseForm } from "@/components/ExpenseForm";
import { LoanForm } from "@/components/LoanForm";
import { SavingsForm } from "@/components/SavingsForm";
import { addExpense } from "@/services/expenseService";
import { addLoan } from "@/services/loanService";
import { addSavingsGoal } from "@/services/savingsService";

type Tab = "expense" | "loan" | "savings";

export const Route = createFileRoute("/add")({
head: () => ({ meta: [{ title: "Add — Loan Tracker" }] }),
component: AddPage,
});

const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = [
{ id: "expense", label: "Expense", icon: Receipt, color: "text-emerald-600" },
{ id: "loan", label: "Loan", icon: Wallet, color: "text-indigo-600" },
{ id: "savings", label: "Savings", icon: PiggyBank, color: "text-amber-600" },
];

function AddPage() {
const navigate = useNavigate();
const [tab, setTab] = useState<Tab>("expense");

const subtitle =
tab === "expense"
? "Log a one-off purchase."
: tab === "loan"
? "Add a new loan or EMI."
: "Start a new savings bucket.";

return (
<MobileShell title="Add" subtitle={subtitle}>
<div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl bg-secondary p-1">
{TABS.map((t) => {
const Icon = t.icon;
const active = tab === t.id;
return (
<button
key={t.id}
type="button"
onClick={() => setTab(t.id)}
className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition ${
active
? "bg-background shadow-sm"
: "text-muted-foreground hover:text-foreground"
}`}
>
<Icon className={`size-4 ${active ? t.color : ""}`} />
{t.label}
</button>
);
})}
</div>

{tab === "expense" && (
<ExpenseForm
submitLabel="Save Expense"
onCancel={() => navigate({ to: "/" })}
onSubmit={(input) => {
addExpense(input);
navigate({ to: "/" });
}}
/>
)}
{tab === "loan" && (
<LoanForm
submitLabel="Save Loan"
onCancel={() => navigate({ to: "/loans" })}
onSubmit={(input) => {
addLoan(input);
navigate({ to: "/loans" });
}}
/>
)}
{tab === "savings" && (
<SavingsForm
submitLabel="Create Goal"
onCancel={() => navigate({ to: "/savings" })}
onSubmit={(input) => {
addSavingsGoal(input);
navigate({ to: "/savings" });
}}
/>
)}
</MobileShell>
);
}
