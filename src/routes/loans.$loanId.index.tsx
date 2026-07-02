import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Archive, ChevronLeft, Pencil } from "lucide-react";
import { archiveLoan, useLoan } from "@/services/loanService";
import { LOAN_TYPE_LABELS } from "@/types/loan";
import { formatPayoff } from "@/lib/loanCalculations";
import { MoneyText } from "@/components/MoneyText";
import { StackedDebtBar } from "@/components/StackedDebtBar";

export const Route = createFileRoute("/loans/$loanId/")({
head: () => ({
meta: [{ title: "Loan Details — Loan Tracker" }],
}),
component: LoanDetailPage,
});

function LoanDetailPage() {
const { loanId } = Route.useParams();
const id = Number(loanId);
const loan = useLoan(id);
const navigate = useNavigate();

if (!loan) {
return (
<div className="mx-auto max-w-2xl px-4 pt-10 text-center">
<p className="text-muted-foreground">Loan not found.</p>
<Link to="/" className="mt-4 inline-block text-sm text-primary underline">
Back to dashboard
</Link>
</div>
);
}

return (
<div className="min-h-screen bg-background">
<div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-6">
<Link
to="/"
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
>
<ChevronLeft className="size-4" />
Dashboard
</Link>

<header className="mt-3 flex items-start justify-between gap-3">
<div className="min-w-0">
<h1 className="truncate text-2xl font-bold tracking-tight">
{loan.name}
</h1>
<div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
<span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
{LOAN_TYPE_LABELS[loan.loanType]}
</span>
{loan.lender ? <span>{loan.lender}</span> : null}
{!loan.isActive ? (
<span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
Archived
</span>
) : null}
</div>
</div>
</header>

<div className="mt-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
<div className="text-xs text-muted-foreground">Current balance</div>
<div className="mt-1 text-3xl font-bold tabular-nums">
<MoneyText value={loan.currentBalance} />
</div>

{(() => {
const paidPct =
loan.totalPaid + loan.currentBalance > 0
? Math.round(
(loan.totalPaid / (loan.totalPaid + loan.currentBalance)) * 100,
)
: 0;
return (
<div className="mt-4">
<div className="flex items-center justify-between text-xs">
<span className="text-muted-foreground">
Paid so far
<span className="ml-1 font-medium text-foreground">{paidPct}%</span>
</span>
<span className="font-medium tabular-nums">
<MoneyText value={loan.totalPaid} />
</span>
</div>
<div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
<div
className="h-full rounded-full bg-primary transition-all"
style={{ width: `${paidPct}%` }}
/>
</div>
</div>
);
})()}

<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
<Stat label="Monthly payment">
<MoneyText value={loan.monthlyPayment} />
</Stat>
<Stat label="Annual interest">
{loan.annualInterestRate.toFixed(2)}%
</Stat>
<Stat label="Monthly fee">
<MoneyText value={loan.monthlyFee} />
</Stat>
<Stat label="Due day">{loan.dueDay ?? "—"}</Stat>
<Stat label="Autopay">{loan.isAutopay ? "On" : "Off"}</Stat>
<Stat label="Est. payoff">{formatPayoff(loan.monthsToPayoff)}</Stat>
</div>
</div>

<div className="mt-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
<h3 className="text-sm font-semibold">Debt breakdown</h3>
<p className="mt-0.5 text-xs text-muted-foreground">
Principal vs interest vs fees
</p>
<div className="mt-4">
<StackedDebtBar
principal={loan.currentBalance}
interest={loan.totalInterest}
fees={loan.totalFees}
/>
</div>
</div>

<div className="mt-4 grid grid-cols-2 gap-3">
<Stat2 label="Total interest">
<MoneyText value={loan.totalInterest} />
</Stat2>
<Stat2 label="Total fees">
<MoneyText value={loan.totalFees} />
</Stat2>
<Stat2 label="Total payable">
<MoneyText value={loan.totalPayable} />
</Stat2>
<Stat2 label="Total cost">
<MoneyText value={loan.totalCost} />
</Stat2>
</div>

{loan.notes ? (
<div className="mt-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
<h3 className="text-sm font-semibold">Notes</h3>
<p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
{loan.notes}
</p>
</div>
) : null}

<div className="mt-6 flex gap-2">
<Link
to="/loans/$loanId/edit"
params={{ loanId: String(loan.id) }}
className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
>
<Pencil className="size-4" />
Edit Loan
</Link>
<button
onClick={() => {
archiveLoan(loan.id);
navigate({ to: "/" });
}}
className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent"
>
<Archive className="size-4" />
Archive
</button>
</div>
</div>
</div>
);
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
return (
<div>
<div className="text-xs text-muted-foreground">{label}</div>
<div className="mt-0.5 font-medium tabular-nums">{children}</div>
</div>
);
}

function Stat2({ label, children }: { label: string; children: React.ReactNode }) {
return (
<div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
<div className="text-xs text-muted-foreground">{label}</div>
<div className="mt-1 text-lg font-semibold tabular-nums">{children}</div>
</div>
);
}
