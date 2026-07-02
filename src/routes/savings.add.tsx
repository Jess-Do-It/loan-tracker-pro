import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { SavingsForm } from "@/components/SavingsForm";
import { addSavingsGoal } from "@/services/savingsService";

export const Route = createFileRoute("/savings/add")({
head: () => ({ meta: [{ title: "Add Savings Goal" }] }),
component: AddSavingsPage,
});

function AddSavingsPage() {
const navigate = useNavigate();
return (
<div className="min-h-screen bg-background">
<div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
<Link
to="/savings"
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
>
<ChevronLeft className="size-4" /> Savings
</Link>
<h1 className="mt-3 text-2xl font-bold tracking-tight">New Goal</h1>
<p className="mt-1 text-sm text-muted-foreground">
Start a savings bucket to track progress.
</p>
<div className="mt-6">
<SavingsForm
submitLabel="Create Goal"
onCancel={() => navigate({ to: "/savings" })}
onSubmit={(input) => {
addSavingsGoal(input);
navigate({ to: "/savings" });
}}
/>
</div>
</div>
</div>
);
}
