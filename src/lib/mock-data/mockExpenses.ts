import type { Expense, RecurringExpense } from "@/types/expense";
import { currentMonthKey, dateInMonth, shiftMonth } from "@/lib/dateHelpers";

export const mockRecurring: RecurringExpense[] = [
{ id: 1, name: "Rent", amount: 12000, category: "rent", dayOfMonth: 1 },
{ id: 2, name: "Electricity", amount: 850, category: "bills", dayOfMonth: 5 },
{ id: 3, name: "Internet", amount: 449, category: "bills", dayOfMonth: 8 },
{ id: 4, name: "Spotify", amount: 119, category: "entertainment", dayOfMonth: 12 },
{ id: 5, name: "Gym", amount: 399, category: "health", dayOfMonth: 15 },
];

// Generate expenses for last 6 months (current + 5 back)
function build(): Expense[] {
const out: Expense[] = [];
let id = 1;
const cur = currentMonthKey();
const months = [5, 4, 3, 2, 1, 0].map((d) => shiftMonth(cur, -d));

// Per-month seeded expenses
const seeds: Array<Omit<Expense, "id" | "date"> & { day: number }> = [
{ name: "Weekly groceries", amount: 720, category: "grocery", day: 3 },
{ name: "Weekly groceries", amount: 685, category: "grocery", day: 10 },
{ name: "Weekly groceries", amount: 812, category: "grocery", day: 17 },
{ name: "Weekly groceries", amount: 640, category: "grocery", day: 24 },
{ name: "Bus pass", amount: 320, category: "transport", day: 2 },
{ name: "Uber", amount: 180, category: "transport", day: 14 },
{ name: "Dinner out", amount: 540, category: "dining", day: 7 },
{ name: "Lunch", amount: 145, category: "dining", day: 18 },
{ name: "Movie", amount: 220, category: "entertainment", day: 20 },
{ name: "Shoes", amount: 690, category: "shopping", day: 22 },
];

months.forEach((mk, idx) => {
const variability = 1 + (idx - 2) * 0.05;
seeds.forEach((s) => {
out.push({
id: id++,
name: s.name,
amount: Math.round(s.amount * variability),
category: s.category,
date: dateInMonth(mk, s.day),
});
});
// recurring already recorded for past months
if (mk !== cur) {
mockRecurring.forEach((r) => {
out.push({
id: id++,
name: r.name,
amount: r.amount,
category: r.category,
date: dateInMonth(mk, r.dayOfMonth),
recurringId: r.id,
});
});
}
});

return out;
}

export const mockExpenses: Expense[] = build();
