import { useSyncExternalStore } from "react";
import type { SavingsGoal, SavingsGoalInput } from "@/types/savings";
import { mockSavings } from "@/lib/mockSavings";
import { hydrate, persist } from "./persistence";
import { persistSavings, removeSavings } from "./dataFns";

let goals: SavingsGoal[] = [...mockSavings];
let nextId = Math.max(0, ...goals.map((g) => g.id)) + 1;

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: Listener) => {
listeners.add(l);
return () => listeners.delete(l);
};

hydrate((snap) => {
goals = snap.savings;
nextId = Math.max(0, ...goals.map((g) => g.id)) + 1;
emit();
});

export function getSavingsGoals() {
return goals;
}

export function getSavingsGoalById(id: number) {
return goals.find((g) => g.id === id);
}

export function getTotalSaved() {
return goals.reduce((s, g) => s + g.currentAmount, 0);
}

export function addSavingsGoal(input: SavingsGoalInput): SavingsGoal {
const g: SavingsGoal = { ...input, id: nextId++ };
goals = [g, ...goals];
emit();
persist(() => persistSavings({ data: g }));
return g;
}

export function updateSavingsGoal(id: number, input: SavingsGoalInput) {
let updated: SavingsGoal | undefined;
goals = goals.map((g) => {
if (g.id !== id) return g;
updated = { ...g, ...input };
return updated;
});
emit();
if (updated) persist(() => persistSavings({ data: updated as SavingsGoal }));
}

export function deleteSavingsGoal(id: number) {
goals = goals.filter((g) => g.id !== id);
emit();
persist(() => removeSavings({ data: id }));
}

export function useSavings() {
return useSyncExternalStore(
subscribe,
() => goals,
() => goals,
);
}
