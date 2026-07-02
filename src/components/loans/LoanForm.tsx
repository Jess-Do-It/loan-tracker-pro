import { useState } from "react";
import type { Loan, LoanInput, LoanType } from "@/types/loan";
import { LOAN_TYPE_LABELS } from "@/types/loan";
import { calculateLoanPreview, formatPayoff } from "@/lib/loanCalculations";
import { MoneyText } from "@/components/common/MoneyText";

type Props = {
initial?: Loan;
submitLabel: string;
showPreview?: boolean;
onSubmit: (input: LoanInput) => void;
onCancel?: () => void;
};

const empty: LoanInput = {
name: "",
loanType: "loan",
lender: "",
currentBalance: 0,
totalPaid: 0,
monthlyPayment: 0,
annualInterestRate: 0,
monthlyFee: 0,
dueDay: undefined,
isAutopay: false,
notes: "",
};

export function LoanForm({
initial,
submitLabel,
showPreview = false,
onSubmit,
onCancel,
}: Props) {
const [form, setForm] = useState<LoanInput>(() =>
initial
? {
name: initial.name,
loanType: initial.loanType,
lender: initial.lender ?? "",
currentBalance: initial.currentBalance,
totalPaid: initial.totalPaid,
monthlyPayment: initial.monthlyPayment,
annualInterestRate: initial.annualInterestRate,
monthlyFee: initial.monthlyFee,
dueDay: initial.dueDay,
isAutopay: initial.isAutopay,
notes: initial.notes ?? "",
}
: empty,
);
const [errors, setErrors] = useState<Record<string, string>>({});

function set<K extends keyof LoanInput>(key: K, value: LoanInput[K]) {
setForm((f) => ({ ...f, [key]: value }));
}

function validate(): boolean {
const e: Record<string, string> = {};
if (!form.name.trim()) e.name = "Name is required";
if (form.currentBalance < 0) e.currentBalance = "Must be ≥ 0";
if (form.totalPaid < 0) e.totalPaid = "Cannot be negative";
if (form.monthlyPayment <= 0) e.monthlyPayment = "Must be greater than 0";
if (form.annualInterestRate < 0) e.annualInterestRate = "Cannot be negative";
if (form.monthlyFee < 0) e.monthlyFee = "Cannot be negative";
if (
form.dueDay !== undefined &&
form.dueDay !== null &&
(form.dueDay < 1 || form.dueDay > 31)
)
e.dueDay = "Must be between 1 and 31";
setErrors(e);
return Object.keys(e).length === 0;
}

function handleSubmit(e: React.FormEvent) {
e.preventDefault();
if (!validate()) return;
onSubmit({
...form,
lender: form.lender?.trim() || undefined,
notes: form.notes?.trim() || undefined,
});
}

const preview = showPreview ? calculateLoanPreview(form) : null;

return (
<form onSubmit={handleSubmit} className="space-y-5">
<Field label="Loan name" error={errors.name}>
<input
className={inputCls}
value={form.name}
onChange={(e) => set("name", e.target.value)}
placeholder="e.g. Car loan"
/>
</Field>

<Field label="Loan type">
<select
className={inputCls}
value={form.loanType}
onChange={(e) => set("loanType", e.target.value as LoanType)}
>
{(Object.keys(LOAN_TYPE_LABELS) as LoanType[]).map((t) => (
<option key={t} value={t}>
{LOAN_TYPE_LABELS[t]}
</option>
))}
</select>
</Field>

<Field label="Lender">
<input
className={inputCls}
value={form.lender ?? ""}
onChange={(e) => set("lender", e.target.value)}
placeholder="Bank, store, person…"
/>
</Field>

<div className="grid grid-cols-2 gap-3">
<Field label="Current balance" error={errors.currentBalance}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.currentBalance === 0 ? "" : form.currentBalance}
onChange={(e) => set("currentBalance", Number(e.target.value))}
/>
</Field>
<Field label="Total paid" error={errors.totalPaid}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.totalPaid === 0 ? "" : form.totalPaid}
onChange={(e) => set("totalPaid", Number(e.target.value))}
/>
</Field>
<Field label="Monthly payment" error={errors.monthlyPayment}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.monthlyPayment === 0 ? "" : form.monthlyPayment}
onChange={(e) => set("monthlyPayment", Number(e.target.value))}
/>
</Field>
<Field label="Annual interest %" error={errors.annualInterestRate}>
<input
type="number"
inputMode="decimal"
step="0.01"
className={inputCls}
placeholder="0"
value={form.annualInterestRate === 0 ? "" : form.annualInterestRate}
onChange={(e) =>
set("annualInterestRate", Number(e.target.value))
}
/>
</Field>
<Field label="Monthly fee" error={errors.monthlyFee}>
<input
type="number"
inputMode="decimal"
className={inputCls}
placeholder="0"
value={form.monthlyFee === 0 ? "" : form.monthlyFee}
onChange={(e) => set("monthlyFee", Number(e.target.value))}
/>
</Field>
<Field label="Due day (1–31)" error={errors.dueDay}>
<input
type="number"
inputMode="numeric"
min={1}
max={31}
className={inputCls}
value={form.dueDay ?? ""}
onChange={(e) =>
set(
"dueDay",
e.target.value === "" ? undefined : Number(e.target.value),
)
}
/>
</Field>
<Field label="Autopay">
<label className="flex h-10 items-center gap-2 rounded-xl border border-input bg-background px-3 text-sm">
<input
type="checkbox"
checked={form.isAutopay}
onChange={(e) => set("isAutopay", e.target.checked)}
/>
<span>Enabled</span>
</label>
</Field>
</div>

<Field label="Notes">
<textarea
className={`${inputCls} min-h-20`}
value={form.notes ?? ""}
onChange={(e) => set("notes", e.target.value)}
placeholder="Optional notes"
/>
</Field>

{preview ? (
<div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
<h4 className="text-sm font-semibold">Preview</h4>
<p className="text-xs text-muted-foreground">
Placeholder estimate — real calculations coming soon.
</p>
<dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
<PreviewRow label="Monthly payment">
<MoneyText value={form.monthlyPayment} />
</PreviewRow>
<PreviewRow label="Current balance">
<MoneyText value={form.currentBalance} />
</PreviewRow>
<PreviewRow label="Interest rate">
{form.annualInterestRate.toFixed(2)}%
</PreviewRow>
<PreviewRow label="Est. payoff">
{formatPayoff(preview.monthsToPayoff)}
</PreviewRow>
<PreviewRow label="Est. total payable">
<MoneyText value={preview.totalPayable} />
</PreviewRow>
</dl>
</div>
) : null}

<div className="flex gap-2 pt-2">
{onCancel ? (
<button
type="button"
onClick={onCancel}
className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent"
>
Cancel
</button>
) : null}
<button
type="submit"
className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
>
{submitLabel}
</button>
</div>
</form>
);
}

const inputCls =
"h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({
label,
error,
children,
}: {
label: string;
error?: string;
children: React.ReactNode;
}) {
return (
<label className="block">
<span className="mb-1.5 block text-xs font-medium text-muted-foreground">
{label}
</span>
{children}
{error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
</label>
);
}

function PreviewRow({
label,
children,
}: {
label: string;
children: React.ReactNode;
}) {
return (
<div>
<dt className="text-xs text-muted-foreground">{label}</dt>
<dd className="font-medium tabular-nums">{children}</dd>
</div>
);
}
