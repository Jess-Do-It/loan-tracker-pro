import { useSyncExternalStore } from "react";
import type { Loan, LoanInput } from "@/types/loan";
import { mockLoans } from "@/lib/mock-data/mockLoans";
import { calculateLoanPreview } from "@/lib/loanCalculations";
import { hydrate, persist } from "./persistence";
import { persistLoan } from "./dataFns";

/**
* Loan service. Seeds from mock data for the initial (SSR-matching) render,
* then hydrates from and writes through to the SQLite database so every change
* persists. UI call sites use the same synchronous API as before.
*/

let loans: Loan[] = [...mockLoans];
let nextId = Math.max(...loans.map((l) => l.id), 0) + 1;

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
listeners.add(l);
return () => listeners.delete(l);
}

// Replace the seed data with persisted rows once the DB snapshot arrives.
hydrate((snap) => {
loans = snap.loans;
nextId = Math.max(0, ...loans.map((l) => l.id)) + 1;
emit();
});

export function getLoans(): Loan[] {
return loans;
}

export function getActiveLoans(): Loan[] {
return loans.filter((l) => l.isActive);
}

export function getLoanById(id: number): Loan | undefined {
return loans.find((l) => l.id === id);
}

export function addLoan(input: LoanInput): Loan {
const calc = calculateLoanPreview(input);
const loan: Loan = {
id: nextId++,
...input,
...calc,
isActive: true,
};
loans = [loan, ...loans];
emit();
persist(() => persistLoan({ data: loan }));
return loan;
}

export function updateLoan(id: number, input: LoanInput): Loan | undefined {
const calc = calculateLoanPreview(input);
let updated: Loan | undefined;
loans = loans.map((l) => {
if (l.id !== id) return l;
updated = { ...l, ...input, ...calc };
return updated;
});
emit();
if (updated) persist(() => persistLoan({ data: updated as Loan }));
return updated;
}

// Add a payment toward closing a loan: increases its totalPaid by `amount`.
// Used when an expense is logged against the "loan" category.
export function addLoanPayment(id: number, amount: number): Loan | undefined {
let updated: Loan | undefined;
loans = loans.map((l) => {
if (l.id !== id) return l;
updated = { ...l, totalPaid: l.totalPaid + amount };
return updated;
});
emit();
if (updated) persist(() => persistLoan({ data: updated as Loan }));
return updated;
}

export function archiveLoan(id: number) {
let archived: Loan | undefined;
loans = loans.map((l) => {
if (l.id !== id) return l;
archived = { ...l, isActive: false };
return archived;
});
emit();
if (archived) persist(() => persistLoan({ data: archived as Loan }));
}

// React hook wrapper
export function useLoans(): Loan[] {
return useSyncExternalStore(
subscribe,
() => loans,
() => loans,
);
}

export function useLoan(id: number): Loan | undefined {
const all = useLoans();
return all.find((l) => l.id === id);
}
