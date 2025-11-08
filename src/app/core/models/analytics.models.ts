export interface SpendingTrend {
  month: string;
  year: number;
  income: number;
  expenses: number;
  savings: number;
  transactionCount: number;
}

export interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  monthlyData: {
    month: string;
    year: number;
    amount: number;
    transactionCount: number;
  }[];
  totalAmount: number;
  averageMonthly: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface IncomeVsExpense {
  period: string;
  income: number;
  expenses: number;
  netSavings: number;
  savingsRate: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  savingsRate: number;
  topExpenseCategory: string;
  topIncomeMonth: string;
  highestExpenseMonth: string;
}

export interface AnalyticsFilters {
  months?: number;
  period?: 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export const TREND_COLORS = {
  decreasing: '#F44336',
  increasing: '#4CAF50',
  stable: '#FF9800',
};

export const TREND_ICONS = {
  increasing: 'trending_up',
  decreasing: 'trending_down',
  stable: 'trending_flat',
};
