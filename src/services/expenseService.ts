import { useSyncExternalStore } from "react";
import type { Expense, ExpenseInput, RecurringExpense } from "@/types/expense";
import { mockExpenses, mockRecurring } from "@/lib/mockExpenses";
import { hydrate, persist } from "./persistence";
import { persistExpense, removeExpense } from "./dataFns";

let expenses: Expense[] = [...mockExpenses];
let recurring: RecurringExpense[] = [...mockRecurring];
let nextId = Math.max(0, ...expenses.map((e) => e.id)) + 1;

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: Listener) => {
listeners.add(l);
return () => listeners.delete(l);
};

hydrate((snap) => {
expenses = snap.expenses;
recurring = snap.recurring;
nextId = Math.max(0, ...expenses.map((e) => e.id)) + 1;
emit();
});

// Remove every expense matching a predicate and mirror each deletion to the DB.
function removeMatching(pred: (e: Expense) => boolean) {
const toRemove = expenses.filter(pred);
if (toRemove.length === 0) return;
expenses = expenses.filter((e) => !pred(e));
emit();
toRemove.forEach((e) => persist(() => removeExpense({ data: e.id })));
}

export function getExpenses() {
return expenses;
}
export function getRecurring() {
return recurring;
}

export function getExpensesForMonth(monthK: string) {
return expenses.filter((e) => e.date.startsWith(monthK));
}

export function addExpense(input: ExpenseInput): Expense {
const e: Expense = { ...input, id: nextId++ };
expenses = [e, ...expenses];
emit();
persist(() => persistExpense({ data: e }));
return e;
}

export function deleteExpense(id: number) {
expenses = expenses.filter((e) => e.id !== id);
emit();
persist(() => removeExpense({ data: id }));
}

export function isRecurringRecorded(recurringId: number, monthK: string) {
return expenses.some(
(e) => e.recurringId === recurringId && e.date.startsWith(monthK),
);
}

export function isLoanRecorded(loanId: number, monthK: string) {
return expenses.some(
(e) => e.sourceLoanId === loanId && e.date.startsWith(monthK),
);
}

function todayIso() {
return new Date().toISOString().slice(0, 10);
}

export function toggleRecurringRecorded(
recurringId: number,
monthK: string,
shouldExist: boolean,
) {
const exists = isRecurringRecorded(recurringId, monthK);
if (shouldExist && !exists) {
const r = recurring.find((x) => x.id === recurringId);
if (!r) return;
addExpense({
name: r.name,
amount: r.amount,
category: r.category,
date: todayIso(),
recurringId: r.id,
});
} else if (!shouldExist && exists) {
removeMatching((e) => e.recurringId === recurringId && e.date.startsWith(monthK));
}
}

export function toggleLoanRecorded(
loanId: number,
loanName: string,
amount: number,
monthK: string,
_dayOfMonth: number,
shouldExist: boolean,
) {
const exists = isLoanRecorded(loanId, monthK);
if (shouldExist && !exists) {
addExpense({
name: `${loanName} EMI`,
amount,
category: "loan",
date: todayIso(),
sourceLoanId: loanId,
});
} else if (!shouldExist && exists) {
removeMatching((e) => e.sourceLoanId === loanId && e.date.startsWith(monthK));
}
}

export function useExpenses() {
return useSyncExternalStore(
subscribe,
() => expenses,
() => expenses,
);
}

export function useRecurring() {
return useSyncExternalStore(
subscribe,
() => recurring,
() => recurring,
);
}
