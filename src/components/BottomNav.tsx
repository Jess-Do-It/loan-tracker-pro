import { Link } from "@tanstack/react-router";
import { ListChecks, BarChart3, Plus, Wallet, PiggyBank } from "lucide-react";

export function BottomNav() {
return (
<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
<div className="mx-auto grid max-w-2xl grid-cols-5 items-end px-2 pt-1">
<NavItem to="/" icon={<ListChecks className="size-5" />} label="Records" exact />
<NavItem to="/charts" icon={<BarChart3 className="size-5" />} label="Charts" />
<div className="flex justify-center">
<Link
to="/add"
aria-label="Add"
className="-mt-6 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition active:scale-95"
>
<Plus className="size-6" />
</Link>
</div>
<NavItem to="/loans" icon={<Wallet className="size-5" />} label="Loans" />
<NavItem to="/savings" icon={<PiggyBank className="size-5" />} label="Savings" />
</div>
</nav>
);
}

function NavItem({
to,
icon,
label,
exact,
}: {
to: string;
icon: React.ReactNode;
label: string;
exact?: boolean;
}) {
return (
<Link
to={to}
activeOptions={{ exact }}
activeProps={{ className: "text-primary" }}
inactiveProps={{ className: "text-muted-foreground" }}
className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition"
>
{icon}
<span>{label}</span>
</Link>
);
}
