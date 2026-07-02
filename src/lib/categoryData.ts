// Single source of truth for expense-category reference data.
//
// The category rows (label, color, tailwind classes, order) are seeded into the
// SQLite `categories` table and read back at runtime — see src/server/db.ts and
// src/services/categoryService.ts. The Lucide *icon* is a React component and
// cannot be stored in the DB, so the table stores an icon NAME and this file maps
// that name back to the component via CATEGORY_ICONS.

import {
  Banknote,
  PiggyBank,
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

import type { ExpenseCategory } from "@/types/expense";

// Plain, serializable shape stored in the `categories` table.
export type CategoryRecord = {
  key: ExpenseCategory;
  label: string;
  icon: string; // Lucide icon name — resolved to a component via CATEGORY_ICONS
  color: string; // hex, for charts
  tint: string; // tailwind bg classes
  text: string; // tailwind text classes
  sortOrder: number;
};

// Icon name -> component. `Package` is the fallback for unknown names.
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Banknote,
  PiggyBank,
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
};

export function iconFor(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? Package;
}

// Seed rows — also used as the SSR / initial-render snapshot before the DB
// hydrates (values match what db.ts seeds, so there is no visible change).
export const categorySeed: CategoryRecord[] = [
  { key: "loan", label: "Loan", icon: "Banknote", color: "#6366f1", tint: "bg-indigo-100 dark:bg-indigo-950/50", text: "text-indigo-600 dark:text-indigo-300", sortOrder: 0 },
  { key: "savings", label: "Savings", icon: "PiggyBank", color: "#22c55e", tint: "bg-green-100 dark:bg-green-950/50", text: "text-green-600 dark:text-green-300", sortOrder: 1 },
  { key: "grocery", label: "Grocery", icon: "ShoppingCart", color: "#10b981", tint: "bg-emerald-100 dark:bg-emerald-950/50", text: "text-emerald-600 dark:text-emerald-300", sortOrder: 2 },
  { key: "transport", label: "Transport", icon: "Bus", color: "#0ea5e9", tint: "bg-sky-100 dark:bg-sky-950/50", text: "text-sky-600 dark:text-sky-300", sortOrder: 3 },
  { key: "entertainment", label: "Entertainment", icon: "Film", color: "#a855f7", tint: "bg-purple-100 dark:bg-purple-950/50", text: "text-purple-600 dark:text-purple-300", sortOrder: 4 },
  { key: "dining", label: "Dining", icon: "Utensils", color: "#f97316", tint: "bg-orange-100 dark:bg-orange-950/50", text: "text-orange-600 dark:text-orange-300", sortOrder: 5 },
  { key: "rent", label: "Rent", icon: "Home", color: "#ef4444", tint: "bg-red-100 dark:bg-red-950/50", text: "text-red-600 dark:text-red-300", sortOrder: 6 },
  { key: "bills", label: "Bills", icon: "Zap", color: "#f59e0b", tint: "bg-amber-100 dark:bg-amber-950/50", text: "text-amber-600 dark:text-amber-300", sortOrder: 7 },
  { key: "health", label: "Health", icon: "HeartPulse", color: "#ec4899", tint: "bg-pink-100 dark:bg-pink-950/50", text: "text-pink-600 dark:text-pink-300", sortOrder: 8 },
  { key: "travel", label: "Travel", icon: "Plane", color: "#14b8a6", tint: "bg-teal-100 dark:bg-teal-950/50", text: "text-teal-600 dark:text-teal-300", sortOrder: 9 },
  { key: "shopping", label: "Shopping", icon: "Sparkles", color: "#d946ef", tint: "bg-fuchsia-100 dark:bg-fuchsia-950/50", text: "text-fuchsia-600 dark:text-fuchsia-300", sortOrder: 10 },
  { key: "other", label: "Other", icon: "Package", color: "#64748b", tint: "bg-slate-100 dark:bg-slate-800/60", text: "text-slate-600 dark:text-slate-300", sortOrder: 11 },
];
