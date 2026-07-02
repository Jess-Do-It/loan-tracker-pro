import {
Banknote,
ShoppingCart,
Bus,
Film,
Utensils,
Home,
Zap,
Sparkles,
HeartPulse,
Plane,
Package,
type LucideIcon,
} from "lucide-react";

export type ExpenseCategory =
| "loan"
| "grocery"
| "transport"
| "entertainment"
| "dining"
| "rent"
| "bills"
| "health"
| "travel"
| "shopping"
| "other";

export type CategoryMeta = {
label: string;
icon: LucideIcon;
color: string; // hex for charts
tint: string; // tailwind bg classes
text: string; // tailwind text classes
};

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
loan: {
label: "Loan",
icon: Banknote,
color: "#6366f1",
tint: "bg-indigo-100 dark:bg-indigo-950/50",
text: "text-indigo-600 dark:text-indigo-300",
},
grocery: {
label: "Grocery",
icon: ShoppingCart,
color: "#10b981",
tint: "bg-emerald-100 dark:bg-emerald-950/50",
text: "text-emerald-600 dark:text-emerald-300",
},
transport: {
label: "Transport",
icon: Bus,
color: "#0ea5e9",
tint: "bg-sky-100 dark:bg-sky-950/50",
text: "text-sky-600 dark:text-sky-300",
},
entertainment: {
label: "Entertainment",
icon: Film,
color: "#a855f7",
tint: "bg-purple-100 dark:bg-purple-950/50",
text: "text-purple-600 dark:text-purple-300",
},
dining: {
label: "Dining",
icon: Utensils,
color: "#f97316",
tint: "bg-orange-100 dark:bg-orange-950/50",
text: "text-orange-600 dark:text-orange-300",
},
rent: {
label: "Rent",
icon: Home,
color: "#ef4444",
tint: "bg-red-100 dark:bg-red-950/50",
text: "text-red-600 dark:text-red-300",
},
bills: {
label: "Bills",
icon: Zap,
color: "#f59e0b",
tint: "bg-amber-100 dark:bg-amber-950/50",
text: "text-amber-600 dark:text-amber-300",
},
health: {
label: "Health",
icon: HeartPulse,
color: "#ec4899",
tint: "bg-pink-100 dark:bg-pink-950/50",
text: "text-pink-600 dark:text-pink-300",
},
travel: {
label: "Travel",
icon: Plane,
color: "#14b8a6",
tint: "bg-teal-100 dark:bg-teal-950/50",
text: "text-teal-600 dark:text-teal-300",
},
shopping: {
label: "Shopping",
icon: Sparkles,
color: "#d946ef",
tint: "bg-fuchsia-100 dark:bg-fuchsia-950/50",
text: "text-fuchsia-600 dark:text-fuchsia-300",
},
other: {
label: "Other",
icon: Package,
color: "#64748b",
tint: "bg-slate-100 dark:bg-slate-800/60",
text: "text-slate-600 dark:text-slate-300",
},
};

export const CATEGORY_LIST = Object.keys(CATEGORY_META) as ExpenseCategory[];

export type Expense = {
id: number;
name: string;
amount: number;
category: ExpenseCategory;
date: string; // ISO yyyy-mm-dd
recurringId?: number; // if generated from recurring template
sourceLoanId?: number; // if generated from a loan EMI
note?: string;
};

export type ExpenseInput = Omit<Expense, "id">;

export type RecurringExpense = {
id: number;
name: string;
amount: number;
category: ExpenseCategory;
dayOfMonth: number;
};
