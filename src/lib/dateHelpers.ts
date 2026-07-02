export function monthKey(d: Date): string {
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function parseMonthKey(key: string): Date {
const [y, m] = key.split("-").map(Number);
return new Date(y, m - 1, 1);
}

export function prettyMonth(key: string): string {
const d = parseMonthKey(key);
return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function shortMonth(key: string): string {
const d = parseMonthKey(key);
return d.toLocaleDateString("en-US", { month: "short" });
}

export function shiftMonth(key: string, delta: number): string {
const d = parseMonthKey(key);
d.setMonth(d.getMonth() + delta);
return monthKey(d);
}

export function currentMonthKey(): string {
return monthKey(new Date());
}

export function isoDate(d: Date): string {
return d.toISOString().slice(0, 10);
}

export function dateInMonth(monthK: string, day: number): string {
const d = parseMonthKey(monthK);
d.setDate(Math.min(day, 28));
return isoDate(d);
}

export function lastNMonths(n: number, fromKey = currentMonthKey()): string[] {
const out: string[] = [];
for (let i = n - 1; i >= 0; i--) out.push(shiftMonth(fromKey, -i));
return out;
}

export function formatDay(iso: string): string {
const d = new Date(iso);
return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}
