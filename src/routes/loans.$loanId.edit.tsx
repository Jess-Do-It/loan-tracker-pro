import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { LoanForm } from "@/components/loans/LoanForm";
import { updateLoan, useLoan } from "@/services/loanService";

export const Route = createFileRoute("/loans/$loanId/edit")({
head: () => ({
meta: [{ title: "Edit Loan — Loan Tracker" }],
}),
component: EditLoanPage,
});

function EditLoanPage() {
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
<div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
<Link
to="/loans/$loanId"
params={{ loanId: String(loan.id) }}
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
>
<ChevronLeft className="size-4" />
{loan.name}
</Link>
<h1 className="mt-3 text-2xl font-bold tracking-tight">Edit Loan</h1>
<p className="mt-1 text-sm text-muted-foreground">
Update details and preview the new estimate before saving.
</p>

<div className="mt-6">
<LoanForm
initial={loan}
submitLabel="Save Changes"
showPreview
onCancel={() =>
navigate({
to: "/loans/$loanId",
params: { loanId: String(loan.id) },
})
}
onSubmit={(input) => {
updateLoan(loan.id, input);
navigate({
to: "/loans/$loanId",
params: { loanId: String(loan.id) },
});
}}
/>
</div>
</div>
</div>
);
}
