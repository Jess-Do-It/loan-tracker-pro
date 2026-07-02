import { useSyncExternalStore } from "react";
import type { Loan, LoanInput } from "@/types/loan";
import { mockLoans } from "@/lib/mockLoans";
import { calculateLoanPreview } from "@/lib/loanCalculations";

/**
* Placeholder loan service. Backed by in-memory mock state today,
* designed so the call sites can later swap to real SQLite without
* changes to UI components.
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
return updated;
}

export function archiveLoan(id: number) {
loans = loans.map((l) => (l.id === id ? { ...l, isActive: false } : l));
emit();
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
