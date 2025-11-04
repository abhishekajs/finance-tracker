export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  categoryId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

export interface BudgetAnalytics extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  categoryId?: string;
}

export interface UpdateBudgetRequest {
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum BudgetStatus {
  ON_TRACK = 'ON_TRACK',
  WARNING = 'WARNING',
  EXCEEDED = 'EXCEEDED',
}

export const BUDGET_PERIOD_LABELS = {
  [BudgetPeriod.WEEKLY]: 'Weekly',
  [BudgetPeriod.MONTHLY]: 'Monthly',
  [BudgetPeriod.YEARLY]: 'Yearly',
};

export const BUDGET_STATUS_COLORS = {
  [BudgetStatus.ON_TRACK]: '#4CAF50',
  [BudgetStatus.WARNING]: '#FF9800',
  [BudgetStatus.EXCEEDED]: '#F44336',
};
