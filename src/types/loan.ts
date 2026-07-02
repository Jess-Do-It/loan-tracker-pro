export type LoanType = "loan" | "emi" | "bnpl" | "credit_card" | "other";

export type Loan = {
id: number;
name: string;
loanType: LoanType;
lender?: string;

currentBalance: number;
monthlyPayment: number;
annualInterestRate: number;
monthlyFee: number;

dueDay?: number;
isAutopay: boolean;
notes?: string;

monthsToPayoff: number;
yearsToPayoff: number;
remainingMonths: number;

totalInterest: number;
totalFees: number;
totalPayable: number;
totalCost: number;

isActive: boolean;
};

export type LoanInput = {
name: string;
loanType: LoanType;
lender?: string;
currentBalance: number;
monthlyPayment: number;
annualInterestRate: number;
monthlyFee: number;
dueDay?: number;
isAutopay: boolean;
notes?: string;
};

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
loan: "Loan",
emi: "EMI",
bnpl: "Buy Now Pay Later",
credit_card: "Credit Card",
other: "Other",
};
