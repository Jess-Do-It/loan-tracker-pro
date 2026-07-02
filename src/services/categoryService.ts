import { useSyncExternalStore } from "react";
import type { ExpenseCategory, CategoryMeta } from "@/types/expense";
import { categorySeed, iconFor, type CategoryRecord } from "@/lib/categoryData";
import { hydrate } from "./persistence";

// Category reference data. Seeds from categorySeed for the initial (SSR-matching)
// render, then hydrates from the SQLite `categories` table. Read-only — the app
// has no category-editing UI, so there is no write-through.

let categories: CategoryRecord[] = [...categorySeed];

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

hydrate((snap) => {
  if (snap.categories?.length) {
    categories = snap.categories;
    emit();
  }
});

export function getCategories(): CategoryRecord[] {
  return categories;
}

// Ordered list of category records (DB-backed).
export function useCategories(): CategoryRecord[] {
  return useSyncExternalStore(
    subscribe,
    () => categories,
    () => categories,
  );
}

// Merge a DB row with its resolved Lucide icon component.
function toMeta(c: CategoryRecord): CategoryMeta {
  return { label: c.label, icon: iconFor(c.icon), color: c.color, tint: c.tint, text: c.text };
}

// Keyed lookup of merged CategoryMeta — the DB-backed replacement for the old
// hardcoded CATEGORY_META map.
export function useCategoryMeta(): Record<ExpenseCategory, CategoryMeta> {
  const list = useCategories();
  const map = {} as Record<ExpenseCategory, CategoryMeta>;
  for (const c of list) map[c.key] = toMeta(c);
  return map;
}
