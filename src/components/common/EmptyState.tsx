import { Link } from "@tanstack/react-router";
import { Plus, Wallet } from "lucide-react";

export function EmptyState() {
return (
<div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
<div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary">
<Wallet className="size-6 text-secondary-foreground" />
</div>
<h3 className="mt-4 text-base font-semibold">No loans yet.</h3>
<p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
Add your first loan to start tracking your monthly payments and payoff
timeline.
</p>
<Link
to="/loans/add"
className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
>
<Plus className="size-4" />
Add Loan
</Link>
</div>
);
}
