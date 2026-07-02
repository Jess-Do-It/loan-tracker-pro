import { type LucideIcon } from "lucide-react";

export type ExpenseCategory =
| "loan"
| "savings"
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

// Runtime shape used by the UI: the DB-backed category row merged with its
// resolved Lucide icon component. The reference data now lives in the SQLite
// `categories` table — see src/lib/categoryData.ts and
// src/services/categoryService.ts. Use useCategoryMeta()/useCategories() to read it.
export type CategoryMeta = {
label: string;
icon: LucideIcon;
color: string; // hex for charts
tint: string; // tailwind bg classes
text: string; // tailwind text classes
};

export type Expense = {
id: number;
name: string;
amount: number;
category: ExpenseCategory;
date: string; // ISO yyyy-mm-dd
recurringId?: number; // if generated from recurring template
sourceLoanId?: number; // if this payment went toward a loan (adds to its totalPaid)
sourceSavingsId?: number; // if this payment went toward a savings goal (adds to currentAmount)
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
