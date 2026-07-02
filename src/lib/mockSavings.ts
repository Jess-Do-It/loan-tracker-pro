import type { SavingsGoal } from "@/types/savings";

export const mockSavings: SavingsGoal[] = [
{
id: 1,
name: "Emergency Fund",
goalAmount: 50000,
currentAmount: 32000,
targetDate: "2026-12-31",
monthlyContribution: 2500,
color: "#10b981",
},
{
id: 2,
name: "Japan Trip",
goalAmount: 30000,
currentAmount: 8500,
targetDate: "2027-04-01",
monthlyContribution: 2000,
color: "#0ea5e9",
},
{
id: 3,
name: "New Laptop",
goalAmount: 18000,
currentAmount: 18000,
targetDate: "2026-09-01",
monthlyContribution: 1500,
color: "#a855f7",
},
{
id: 4,
name: "House Down Payment",
goalAmount: 200000,
currentAmount: 45000,
targetDate: "2029-01-01",
monthlyContribution: 5000,
color: "#f59e0b",
},
];
