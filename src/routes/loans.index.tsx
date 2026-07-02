import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { LoanCard } from "@/components/loans/LoanCard";
import { EmptyState } from "@/components/common/EmptyState";
import { MoneyText } from "@/components/common/MoneyText";
import { useLoans } from "@/services/loanService";
import { calculateDashboardSummary, formatPayoff } from "@/lib/loanCalculations";

export const Route = createFileRoute("/loans/")({
head: () => ({ meta: [{ title: "Loans — Loan Tracker" }] }),
component: LoansListPage,
});

function LoansListPage() {
const loans = useLoans();
const active = loans.filter((l) => l.isActive);
const summary = calculateDashboardSummary(loans);

return (
<MobileShell title="Loans" subtitle="All your active debt.">
{active.length === 0 ? (
<EmptyState />
) : (
<div className="space-y-4">
<div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
<div className="text-[10px] uppercase tracking-wide opacity-80">
Debt-free in
</div>
<div className="mt-1 text-2xl font-bold">
{formatPayoff(summary.debtFreeMonths)}
</div>
<div className="mt-3 grid grid-cols-2 gap-3 text-xs">
<div>
<div className="opacity-80">Monthly</div>
<MoneyText value={summary.monthlyExpense} className="font-semibold" />
</div>
<div>
<div className="opacity-80">Total payable</div>
<MoneyText value={summary.totalPayable} className="font-semibold" />
</div>
</div>
</div>

<div className="flex items-center justify-between">
<span className="text-xs text-muted-foreground">
{active.length} active
</span>
<Link
to="/loans/add"
className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-secondary/80"
>
<Plus className="size-3.5" />
Add Loan
</Link>
</div>

<ul className="space-y-3">
{active.map((loan) => (
<li key={loan.id}>
<LoanCard loan={loan} />
</li>
))}
</ul>
</div>
)}
</MobileShell>
);
}
