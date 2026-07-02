import type { Loan, LoanInput } from "@/types/loan";

/**
* Placeholder calculation helpers. The real amortization engine will
* replace these later. For now we use simple, transparent estimates so
* the UI has reasonable numbers to display.
*/

export type LoanPreview = {
monthsToPayoff: number;
yearsToPayoff: number;
remainingMonths: number;
totalInterest: number;
totalFees: number;
totalPayable: number;
totalCost: number;
};

export function calculateLoanPreview(input: LoanInput): LoanPreview {
const balance = Math.max(0, input.currentBalance);
const payment = Math.max(1, input.monthlyPayment);
const monthsRaw = balance > 0 ? Math.ceil(balance / payment) : 0;
const months = Math.max(monthsRaw, 0);

// Naive interest estimate: average balance * APR * years
const years = months / 12;
const avgBalance = balance / 2;
const totalInterest = Math.round(
avgBalance * (input.annualInterestRate / 100) * years,
);
const totalFees = Math.round(input.monthlyFee * months);
const totalPayable = balance + totalInterest + totalFees;
const totalCost = totalInterest + totalFees;

return {
monthsToPayoff: months,
yearsToPayoff: Math.floor(years),
remainingMonths: months % 12,
totalInterest,
totalFees,
totalPayable,
totalCost,
};
}

export type DashboardSummary = {
totalDebt: number;
monthlyExpense: number;
interestLeft: number;
feesLeft: number;
totalPayable: number;
debtFreeMonths: number;
debtFreeYears: number;
debtFreeRemainingMonths: number;
activeLoanCount: number;
};

export function calculateDashboardSummary(loans: Loan[]): DashboardSummary {
const active = loans.filter((l) => l.isActive);
const totalDebt = active.reduce((s, l) => s + l.currentBalance, 0);
const monthlyExpense = active.reduce((s, l) => s + l.monthlyPayment, 0);
const interestLeft = active.reduce((s, l) => s + l.totalInterest, 0);
const feesLeft = active.reduce((s, l) => s + l.totalFees, 0);
const totalPayable = active.reduce((s, l) => s + l.totalPayable, 0);
const debtFreeMonths = active.reduce(
(m, l) => Math.max(m, l.monthsToPayoff),
0,
);
return {
totalDebt,
monthlyExpense,
interestLeft,
feesLeft,
totalPayable,
debtFreeMonths,
debtFreeYears: Math.floor(debtFreeMonths / 12),
debtFreeRemainingMonths: debtFreeMonths % 12,
activeLoanCount: active.length,
};
}

export function formatPayoff(months: number): string {
if (months <= 0) return "Paid off";
const y = Math.floor(months / 12);
const m = months % 12;
if (y === 0) return `${m} mo`;
if (m === 0) return `${y} yr`;
return `${y} yr ${m} mo`;
}
