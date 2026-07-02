import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route for a single loan. It only renders an <Outlet/> so its children
// — the detail page (loans.$loanId.index.tsx) and the edit page
// (loans.$loanId.edit.tsx) — each render as full, standalone screens.
export const Route = createFileRoute("/loans/$loanId")({
component: LoanLayout,
});

function LoanLayout() {
return <Outlet />;
}
