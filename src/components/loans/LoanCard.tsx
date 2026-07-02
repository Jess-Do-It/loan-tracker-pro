import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Loan } from "@/types/loan";
import { LOAN_TYPE_LABELS } from "@/types/loan";
import { MoneyText } from "@/components/common/MoneyText";
import { formatPayoff } from "@/lib/loanCalculations";

export function LoanCard({ loan }: { loan: Loan }) {
return (
<Link
to="/loans/$loanId"
params={{ loanId: String(loan.id) }}
className="block rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition hover:border-border hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
>
<div className="flex items-start justify-between gap-3">
<div className="min-w-0 flex-1">
<div className="flex items-center gap-2">
<h3 className="truncate text-base font-semibold">{loan.name}</h3>
<span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
{LOAN_TYPE_LABELS[loan.loanType]}
</span>
</div>
{loan.lender ? (
<div className="mt-0.5 truncate text-xs text-muted-foreground">
{loan.lender}
</div>
) : null}
</div>
<ChevronRight className="size-5 shrink-0 text-muted-foreground" />
</div>

<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
<div>
<div className="text-xs text-muted-foreground">Balance</div>
<MoneyText value={loan.currentBalance} className="font-semibold" />
</div>
<div>
<div className="text-xs text-muted-foreground">Monthly</div>
<MoneyText value={loan.monthlyPayment} className="font-semibold" />
</div>
<div>
<div className="text-xs text-muted-foreground">APR</div>
<div className="font-medium tabular-nums">
{loan.annualInterestRate.toFixed(2)}%
</div>
</div>
<div>
<div className="text-xs text-muted-foreground">Payoff</div>
<div className="font-medium">{formatPayoff(loan.monthsToPayoff)}</div>
</div>
</div>

<div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
<span className="text-muted-foreground">Total payable</span>
<MoneyText value={loan.totalPayable} className="font-semibold" />
</div>
</Link>
);
}
