import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

export function MobileShell({
title,
subtitle,
children,
}: {
title: string;
subtitle?: string;
children: ReactNode;
}) {
return (
<div className="min-h-screen bg-background">
<div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-6">
<header className="mb-5">
<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
{subtitle ? (
<p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
) : null}
</header>
{children}
</div>
<BottomNav />
</div>
);
}
