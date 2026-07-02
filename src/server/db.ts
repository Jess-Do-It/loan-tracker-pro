// Server-only SQLite layer.
//
// Uses the runtime's built-in SQLite — Bun's `bun:sqlite` or Node's `node:sqlite`
// (stable in Node 22+/25) — so there is NO native module to compile or install.
// This file must only ever be imported from server-function handlers (see
// src/server/dataFns.ts) — never from a module that reaches the browser bundle.
//
// The database lives at <project root>/data/loan-tracker.db and is seeded once
// from the original Lovable mock data the first time it is created. After that,
// the DB is the source of truth and the mock generators are no longer consulted.

import { mkdirSync } from "node:fs";
import { join } from "node:path";

import type { Loan } from "@/types/loan";
import type { Expense, RecurringExpense } from "@/types/expense";
import type { SavingsGoal } from "@/types/savings";
import type { CategoryRecord } from "@/lib/categoryData";

import { mockLoans } from "@/lib/mock-data/mockLoans";
import { mockExpenses, mockRecurring } from "@/lib/mock-data/mockExpenses";
import { mockSavings } from "@/lib/mock-data/mockSavings";
import { categorySeed } from "@/lib/categoryData";

// Minimal structural shape shared by node:sqlite (DatabaseSync) and bun:sqlite
// (Database). We only rely on the intersection of their APIs.
interface SqliteStatement {
  run(...params: unknown[]): unknown;
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
}
interface SqliteDb {
  exec(sql: string): unknown;
  prepare(sql: string): SqliteStatement;
}

// Pick the SQLite driver that matches the runtime executing the server function:
// Bun ships `bun:sqlite`, Node (22+/25) ships the built-in `node:sqlite`. Neither
// is a dependency to install. The specifier is a variable + @vite-ignore so the
// bundler never tries to resolve the driver for the wrong runtime.
const isBun = typeof (globalThis as { Bun?: unknown }).Bun !== "undefined";
const driverSpecifier = isBun ? "bun:sqlite" : "node:sqlite";
const sqliteModule = (await import(/* @vite-ignore */ driverSpecifier)) as {
  Database?: new (path: string) => SqliteDb;
  DatabaseSync?: new (path: string) => SqliteDb;
};
const DatabaseCtor = (isBun ? sqliteModule.Database : sqliteModule.DatabaseSync)!;

let db: SqliteDb | undefined;

function getDb(): SqliteDb {
  if (db) return db;

  const dataDir = join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });

  db = new DatabaseCtor(join(dataDir, "loan-tracker.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  migrate(db);
  seedIfEmpty(db);
  return db;
}

function migrate(d: SqliteDb) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS loans (
      id                 INTEGER PRIMARY KEY,
      name               TEXT    NOT NULL,
      loanType           TEXT    NOT NULL,
      lender             TEXT,
      currentBalance     REAL    NOT NULL,
      totalPaid          REAL    NOT NULL DEFAULT 0,
      monthlyPayment     REAL    NOT NULL,
      annualInterestRate REAL    NOT NULL,
      monthlyFee         REAL    NOT NULL,
      dueDay             INTEGER,
      isAutopay          INTEGER NOT NULL DEFAULT 0,
      notes              TEXT,
      monthsToPayoff     INTEGER NOT NULL,
      yearsToPayoff      INTEGER NOT NULL,
      remainingMonths    INTEGER NOT NULL,
      totalInterest      REAL    NOT NULL,
      totalFees          REAL    NOT NULL,
      totalPayable       REAL    NOT NULL,
      totalCost          REAL    NOT NULL,
      isActive           INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id              INTEGER PRIMARY KEY,
      name            TEXT    NOT NULL,
      amount          REAL    NOT NULL,
      category        TEXT    NOT NULL,
      date            TEXT    NOT NULL,
      recurringId     INTEGER,
      sourceLoanId    INTEGER,
      sourceSavingsId INTEGER,
      note            TEXT
    );

    CREATE TABLE IF NOT EXISTS recurring (
      id         INTEGER PRIMARY KEY,
      name       TEXT    NOT NULL,
      amount     REAL    NOT NULL,
      category   TEXT    NOT NULL,
      dayOfMonth INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS savings (
      id                  INTEGER PRIMARY KEY,
      name                TEXT    NOT NULL,
      goalAmount          REAL    NOT NULL,
      currentAmount       REAL    NOT NULL,
      targetDate          TEXT,
      monthlyContribution REAL    NOT NULL,
      color               TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      key       TEXT    PRIMARY KEY,
      label     TEXT    NOT NULL,
      icon      TEXT    NOT NULL,
      color     TEXT    NOT NULL,
      tint      TEXT    NOT NULL,
      text      TEXT    NOT NULL,
      sortOrder INTEGER NOT NULL
    );
  `);

  // Additive migrations for databases created before a column existed.
  ensureColumn(d, "loans", "totalPaid", "REAL NOT NULL DEFAULT 0");
  ensureColumn(d, "expenses", "sourceSavingsId", "INTEGER");
}

// Adds a column to an existing table if it isn't already present (CREATE TABLE
// IF NOT EXISTS never alters an existing table, so new columns need this).
function ensureColumn(d: SqliteDb, table: string, column: string, decl: string) {
  const cols = d.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    d.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${decl}`);
  }
}

function seedIfEmpty(d: SqliteDb) {
  const count = (table: string) =>
    (d.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n;

  if (count("loans") === 0) mockLoans.forEach((l) => insertLoan(d, l));
  if (count("recurring") === 0) mockRecurring.forEach((r) => insertRecurring(d, r));
  if (count("expenses") === 0) mockExpenses.forEach((e) => insertExpense(d, e));
  if (count("savings") === 0) mockSavings.forEach((g) => insertSavings(d, g));
  // Categories are read-only reference data, so keep them in sync with the seed
  // on every boot (INSERT OR REPLACE) — this adds newly-defined categories to
  // existing databases without wiping the transactional tables.
  categorySeed.forEach((c) => insertCategory(d, c));
}

/* ---------- row <-> object mapping ---------- */

const bool = (v: boolean) => (v ? 1 : 0);
const opt = <T>(v: T | undefined): T | null => (v === undefined ? null : v);

function rowToLoan(r: Record<string, unknown>): Loan {
  return {
    id: r.id as number,
    name: r.name as string,
    loanType: r.loanType as Loan["loanType"],
    lender: (r.lender as string) ?? undefined,
    currentBalance: r.currentBalance as number,
    totalPaid: (r.totalPaid as number) ?? 0,
    monthlyPayment: r.monthlyPayment as number,
    annualInterestRate: r.annualInterestRate as number,
    monthlyFee: r.monthlyFee as number,
    dueDay: (r.dueDay as number) ?? undefined,
    isAutopay: !!r.isAutopay,
    notes: (r.notes as string) ?? undefined,
    monthsToPayoff: r.monthsToPayoff as number,
    yearsToPayoff: r.yearsToPayoff as number,
    remainingMonths: r.remainingMonths as number,
    totalInterest: r.totalInterest as number,
    totalFees: r.totalFees as number,
    totalPayable: r.totalPayable as number,
    totalCost: r.totalCost as number,
    isActive: !!r.isActive,
  };
}

function rowToExpense(r: Record<string, unknown>): Expense {
  return {
    id: r.id as number,
    name: r.name as string,
    amount: r.amount as number,
    category: r.category as Expense["category"],
    date: r.date as string,
    recurringId: (r.recurringId as number) ?? undefined,
    sourceLoanId: (r.sourceLoanId as number) ?? undefined,
    sourceSavingsId: (r.sourceSavingsId as number) ?? undefined,
    note: (r.note as string) ?? undefined,
  };
}

function rowToRecurring(r: Record<string, unknown>): RecurringExpense {
  return {
    id: r.id as number,
    name: r.name as string,
    amount: r.amount as number,
    category: r.category as RecurringExpense["category"],
    dayOfMonth: r.dayOfMonth as number,
  };
}

function rowToSavings(r: Record<string, unknown>): SavingsGoal {
  return {
    id: r.id as number,
    name: r.name as string,
    goalAmount: r.goalAmount as number,
    currentAmount: r.currentAmount as number,
    targetDate: (r.targetDate as string) ?? undefined,
    monthlyContribution: r.monthlyContribution as number,
    color: (r.color as string) ?? undefined,
  };
}

function rowToCategory(r: Record<string, unknown>): CategoryRecord {
  return {
    key: r.key as CategoryRecord["key"],
    label: r.label as string,
    icon: r.icon as string,
    color: r.color as string,
    tint: r.tint as string,
    text: r.text as string,
    sortOrder: r.sortOrder as number,
  };
}

/* ---------- insert helpers (also used for seeding) ---------- */

function insertLoan(d: SqliteDb, l: Loan) {
  d.prepare(
    `INSERT OR REPLACE INTO loans
      (id, name, loanType, lender, currentBalance, totalPaid, monthlyPayment, annualInterestRate,
       monthlyFee, dueDay, isAutopay, notes, monthsToPayoff, yearsToPayoff, remainingMonths,
       totalInterest, totalFees, totalPayable, totalCost, isActive)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    l.id, l.name, l.loanType, opt(l.lender), l.currentBalance, l.totalPaid, l.monthlyPayment,
    l.annualInterestRate, l.monthlyFee, opt(l.dueDay), bool(l.isAutopay), opt(l.notes),
    l.monthsToPayoff, l.yearsToPayoff, l.remainingMonths, l.totalInterest, l.totalFees,
    l.totalPayable, l.totalCost, bool(l.isActive),
  );
}

function insertExpense(d: SqliteDb, e: Expense) {
  d.prepare(
    `INSERT OR REPLACE INTO expenses
      (id, name, amount, category, date, recurringId, sourceLoanId, sourceSavingsId, note)
     VALUES (?,?,?,?,?,?,?,?,?)`,
  ).run(e.id, e.name, e.amount, e.category, e.date, opt(e.recurringId), opt(e.sourceLoanId), opt(e.sourceSavingsId), opt(e.note));
}

function insertRecurring(d: SqliteDb, r: RecurringExpense) {
  d.prepare(
    `INSERT OR REPLACE INTO recurring (id, name, amount, category, dayOfMonth)
     VALUES (?,?,?,?,?)`,
  ).run(r.id, r.name, r.amount, r.category, r.dayOfMonth);
}

function insertSavings(d: SqliteDb, g: SavingsGoal) {
  d.prepare(
    `INSERT OR REPLACE INTO savings
      (id, name, goalAmount, currentAmount, targetDate, monthlyContribution, color)
     VALUES (?,?,?,?,?,?,?)`,
  ).run(g.id, g.name, g.goalAmount, g.currentAmount, opt(g.targetDate), g.monthlyContribution, opt(g.color));
}

function insertCategory(d: SqliteDb, c: CategoryRecord) {
  d.prepare(
    `INSERT OR REPLACE INTO categories (key, label, icon, color, tint, text, sortOrder)
     VALUES (?,?,?,?,?,?,?)`,
  ).run(c.key, c.label, c.icon, c.color, c.tint, c.text, c.sortOrder);
}

/* ---------- public API (server-side, synchronous) ---------- */

export function readAll() {
  const d = getDb();
  return {
    loans: (d.prepare("SELECT * FROM loans").all() as Record<string, unknown>[]).map(rowToLoan),
    expenses: (d.prepare("SELECT * FROM expenses").all() as Record<string, unknown>[]).map(rowToExpense),
    recurring: (d.prepare("SELECT * FROM recurring").all() as Record<string, unknown>[]).map(rowToRecurring),
    savings: (d.prepare("SELECT * FROM savings").all() as Record<string, unknown>[]).map(rowToSavings),
    categories: (d.prepare("SELECT * FROM categories ORDER BY sortOrder").all() as Record<string, unknown>[]).map(rowToCategory),
  };
}

export function upsertLoan(l: Loan) {
  insertLoan(getDb(), l);
}

export function upsertRecurring(r: RecurringExpense) {
  insertRecurring(getDb(), r);
}

export function deleteLoanRow(id: number) {
  getDb().prepare("DELETE FROM loans WHERE id = ?").run(id);
}

export function upsertExpense(e: Expense) {
  insertExpense(getDb(), e);
}

export function deleteExpenseRow(id: number) {
  getDb().prepare("DELETE FROM expenses WHERE id = ?").run(id);
}

export function upsertSavings(g: SavingsGoal) {
  insertSavings(getDb(), g);
}

export function deleteSavingsRow(id: number) {
  getDb().prepare("DELETE FROM savings WHERE id = ?").run(id);
}
