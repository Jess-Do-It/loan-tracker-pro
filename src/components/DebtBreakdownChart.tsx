import { StackedDebtBar } from "./StackedDebtBar";
import type { Loan } from "@/types/loan";

export function DebtBreakdownChart({ loans }: { loans: Loan[] }) {
const principal = loans.reduce((s, l) => s + l.currentBalance, 0);
const interest = loans.reduce((s, l) => s + l.totalInterest, 0);
const fees = loans.reduce((s, l) => s + l.totalFees, 0);

return (
<div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
<h3 className="text-sm font-semibold">Debt breakdown</h3>
<p className="mt-0.5 text-xs text-muted-foreground">
Principal, interest and fees across all loans
</p>
<div className="mt-4">
<StackedDebtBar
principal={principal}
interest={interest}
fees={fees}
/>
</div>
</div>
);
}
