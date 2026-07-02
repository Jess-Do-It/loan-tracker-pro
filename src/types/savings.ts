export type SavingsGoal = {
id: number;
name: string;
goalAmount: number;
currentAmount: number;
targetDate?: string; // ISO yyyy-mm-dd
monthlyContribution: number;
color?: string;
};

export type SavingsGoalInput = Omit<SavingsGoal, "id">;
