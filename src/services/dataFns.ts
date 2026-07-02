// TanStack Start server functions — the client-callable bridge to SQLite.
//
// The db module is imported dynamically inside each handler so that `node:sqlite`
// and the database file are only ever loaded on the server, never bundled for the
// browser. Handlers run server-side; the client invokes them as RPCs.

import { createServerFn } from "@tanstack/react-start";

import type { Loan } from "@/types/loan";
import type { Expense, RecurringExpense } from "@/types/expense";
import type { SavingsGoal } from "@/types/savings";

export const loadAllData = createServerFn({ method: "GET" }).handler(async () => {
  const { readAll } = await import("@/server/db");
  return readAll();
});

export const persistLoan = createServerFn({ method: "POST" })
  .validator((loan: Loan) => loan)
  .handler(async ({ data }) => {
    const { upsertLoan } = await import("@/server/db");
    upsertLoan(data);
  });

export const removeLoan = createServerFn({ method: "POST" })
  .validator((id: number) => id)
  .handler(async ({ data }) => {
    const { deleteLoanRow } = await import("@/server/db");
    deleteLoanRow(data);
  });

export const persistExpense = createServerFn({ method: "POST" })
  .validator((expense: Expense) => expense)
  .handler(async ({ data }) => {
    const { upsertExpense } = await import("@/server/db");
    upsertExpense(data);
  });

export const removeExpense = createServerFn({ method: "POST" })
  .validator((id: number) => id)
  .handler(async ({ data }) => {
    const { deleteExpenseRow } = await import("@/server/db");
    deleteExpenseRow(data);
  });

export const persistRecurring = createServerFn({ method: "POST" })
  .validator((r: RecurringExpense) => r)
  .handler(async ({ data }) => {
    const { upsertRecurring } = await import("@/server/db");
    upsertRecurring(data);
  });

export const persistSavings = createServerFn({ method: "POST" })
  .validator((goal: SavingsGoal) => goal)
  .handler(async ({ data }) => {
    const { upsertSavings } = await import("@/server/db");
    upsertSavings(data);
  });

export const removeSavings = createServerFn({ method: "POST" })
  .validator((id: number) => id)
  .handler(async ({ data }) => {
    const { deleteSavingsRow } = await import("@/server/db");
    deleteSavingsRow(data);
  });
