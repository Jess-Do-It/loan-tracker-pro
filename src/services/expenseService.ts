import { useSyncExternalStore } from "react";
import type { Expense, ExpenseInput, RecurringExpense } from "@/types/expense";
import { mockExpenses, mockRecurring } from "@/lib/mock-data/mockExpenses";
import { dateInMonth } from "@/lib/dateHelpers";
import { hydrate, persist } from "./persistence";
import { persistExpense, removeExpense, persistRecurring, removeRecurring } from "./dataFns";
import { addLoanPayment } from "./loanService";
import { addSavingsContribution } from "./savingsService";

let expenses: Expense[] = [...mockExpenses];
let recurring: RecurringExpense[] = [...mockRecurring];
let nextId = Math.max(0, ...expenses.map((e) => e.id)) + 1;
let nextRecurringId = Math.max(0, ...recurring.map((r) => r.id)) + 1;

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
nextRecurringId = Math.max(0, ...recurring.map((r) => r.id)) + 1;
emit();
});

// Undo the loan/savings side effect an expense applied when it was recorded:
// subtract its amount back out of the loan's totalPaid or the goal's currentAmount.
function reverseExpenseEffect(e: Expense) {
if (e.sourceLoanId != null) addLoanPayment(e.sourceLoanId, -e.amount);
else if (e.sourceSavingsId != null) addSavingsContribution(e.sourceSavingsId, -e.amount);
}

// Remove every expense matching a predicate, mirror each deletion to the DB, and
// reverse any loan/savings contribution it made.
function removeMatching(pred: (e: Expense) => boolean) {
const toRemove = expenses.filter(pred);
if (toRemove.length === 0) return;
expenses = expenses.filter((e) => !pred(e));
emit();
toRemove.forEach((e) => {
persist(() => removeExpense({ data: e.id }));
reverseExpenseEffect(e);
});
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

// Add a recurring template (persists to the recurring table).
export function addRecurring(input: Omit<RecurringExpense, "id">): RecurringExpense {
const r: RecurringExpense = { ...input, id: nextRecurringId++ };
recurring = [r, ...recurring];
emit();
persist(() => persistRecurring({ data: r }));
return r;
}

// Delete a recurring template. It stops appearing as a task in the current and
// all future months. Already-recorded expenses in past months are left intact
// as history.
export function deleteRecurring(id: number) {
recurring = recurring.filter((r) => r.id !== id);
emit();
persist(() => removeRecurring({ data: id }));
}

/**
* Record an expense from the Add screen, and — when it is categorized against a
* loan or savings goal — apply the amount to that target (loan.totalPaid or
* savings.currentAmount). The expense itself always lands in the history. When
* `recurring` is set, a recurring template is also created from the same input.
*/
export function recordExpense(
input: ExpenseInput,
opts?: { recurring?: boolean },
): Expense {
// When "recurring" is set, create the template first so we can link THIS
// month's expense to it (recurringId). That makes the recurring checklist treat
// the current month as already recorded (hidden), while future months surface
// it as an unchecked checkbox to log when paid.
let recurringId = input.recurringId;
if (opts?.recurring) {
const dayOfMonth = Math.min(31, Math.max(1, Number(input.date.slice(8, 10)) || 1));
const template = addRecurring({
name: input.name,
amount: input.amount,
category: input.category,
dayOfMonth,
});
recurringId = template.id;
}

const e = addExpense({ ...input, recurringId });
if (input.category === "loan" && input.sourceLoanId != null) {
addLoanPayment(input.sourceLoanId, input.amount);
} else if (input.category === "savings" && input.sourceSavingsId != null) {
addSavingsContribution(input.sourceSavingsId, input.amount);
}
return e;
}

export function deleteExpense(id: number) {
const removed = expenses.find((e) => e.id === id);
expenses = expenses.filter((e) => e.id !== id);
emit();
persist(() => removeExpense({ data: id }));
// If this record was a loan payment / savings contribution, take the amount
// back out of the loan's totalPaid / goal's currentAmount.
if (removed) reverseExpenseEffect(removed);
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
date: dateInMonth(monthK, r.dayOfMonth),
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
dayOfMonth: number,
shouldExist: boolean,
) {
const exists = isLoanRecorded(loanId, monthK);
if (shouldExist && !exists) {
addExpense({
name: `${loanName} EMI`,
amount,
category: "loan",
date: dateInMonth(monthK, dayOfMonth),
sourceLoanId: loanId,
});
// Recording an EMI is a payment toward the loan, so count it in totalPaid
// (removeMatching reverses this on uncheck / delete).
addLoanPayment(loanId, amount);
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
