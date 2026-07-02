import { type ExpenseCategory } from "@/types/expense";
import { useCategoryMeta } from "@/services/categoryService";
import { cn } from "@/lib/utils";

export function CategoryIcon({
category,
size = "md",
className,
}: {
category: ExpenseCategory;
size?: "sm" | "md" | "lg";
className?: string;
}) {
const meta = useCategoryMeta()[category];
const Icon = meta.icon;
const dims =
size === "sm" ? "size-8" : size === "lg" ? "size-12" : "size-10";
const iconSize =
size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5";
return (
<div
className={cn(
"grid place-items-center rounded-full",
dims,
meta.tint,
className,
)}
>
<Icon className={cn(iconSize, meta.text)} />
</div>
);
}
