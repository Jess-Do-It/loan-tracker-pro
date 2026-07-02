import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { LoanForm } from "@/components/LoanForm";
import { addLoan } from "@/services/loanService";

export const Route = createFileRoute("/loans/add")({
head: () => ({
meta: [
{ title: "Add Loan — Loan Tracker" },
{ name: "description", content: "Add a new loan to your tracker." },
],
}),
component: AddLoanPage,
});

function AddLoanPage() {
const navigate = useNavigate();
return (
<div className="min-h-screen bg-background">
<div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
<Link
to="/"
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
>
<ChevronLeft className="size-4" />
Dashboard
</Link>
<h1 className="mt-3 text-2xl font-bold tracking-tight">Add Loan</h1>
<p className="mt-1 text-sm text-muted-foreground">
Enter loan details. Estimates are placeholders for now.
</p>

<div className="mt-6">
<LoanForm
submitLabel="Save Loan"
onCancel={() => navigate({ to: "/" })}
onSubmit={(input) => {
addLoan(input);
navigate({ to: "/" });
}}
/>
</div>
</div>
</div>
);
}
