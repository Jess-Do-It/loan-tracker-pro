import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { ExpensesPieChart } from "@/components/ExpensesPieChart";
import { LoanColumnChart } from "@/components/LoanColumnChart";
import { SavingsBucket } from "@/components/SavingsBucket";
import { useExpenses } from "@/services/expenseService";
import { useLoans } from "@/services/loanService";
import { useSavings } from "@/services/savingsService";
import { currentMonthKey } from "@/lib/dateHelpers";

export const Route = createFileRoute("/charts")({
head: () => ({ meta: [{ title: "Charts — Loan Tracker" }] }),
component: ChartsPage,
});

function ChartsPage() {
const [month, setMonth] = useState(currentMonthKey());
const allExpenses = useExpenses();
const loans = useLoans().filter((l) => l.isActive);
const goals = useSavings();

const monthRecords = useMemo(
() => allExpenses.filter((e) => e.date.startsWith(month)),
[allExpenses, month],
);

return (
<MobileShell title="Charts" subtitle="Visualize your money.">
<div className="space-y-5">
<MonthSwitcher value={month} onChange={setMonth} />

<section>
<h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
Expenses
</h2>
<ExpensesPieChart records={monthRecords} />
</section>

<section>
<h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
Loans
</h2>
<LoanColumnChart loans={loans} />
</section>

<section>
<h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
Savings
</h2>
<div className="space-y-3">
{goals.length === 0 ? (
<div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
No savings goals yet.
</div>
) : (
goals.map((g) => <SavingsBucket key={g.id} goal={g} />)
)}
</div>
</section>
</div>
</MobileShell>
);
}
