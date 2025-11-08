import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { CategoryService } from './category.service';
import { Transaction, TransactionType } from '../models/transaction.models';
import { ChartConfiguration } from 'chart.js';
import { BudgetService } from './budget.service';

export interface DashboardStats {
  totalBalance: number;
  totalAccounts: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface CategoryAnalytics {
  topCategories: CategorySpending[];
  totalCategorizedSpending: number;
  uncategorizedSpending: number;
}

export interface BudgetSummary {
  totalBudgets: number;
  activeBudgets: number;
  budgetsOnTrack: number;
  budgetsExceeded: number;
  totalBudgetAmount: number;
  totalSpent: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private budgetService: BudgetService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      accounts: this.accountService.getAccounts(),
      transactions: this.transactionService.getTransactions({ limit: 1000 }),
    }).pipe(
      map(({ accounts, transactions }) => {
        const totalBalance = accounts.reduce(
          (sum, account) => sum + Number(account.balance),
          0
        );
        const totalAccounts = accounts.length;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        });

        const monthlyIncome = monthlyTransactions
          .filter(t => t.type === TransactionType.INCOME)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const monthlyExpenses = monthlyTransactions
          .filter(t => t.type === TransactionType.EXPENSE)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const monthlySavings = monthlyIncome - monthlyExpenses;

        return {
          totalBalance,
          totalAccounts,
          monthlyIncome,
          monthlyExpenses,
          monthlySavings,
        };
      })
    );
  }

  getCategoryAnalytics(): Observable<CategoryAnalytics> {
    return forkJoin({
      transactions: this.transactionService.getTransactions({ limit: 100 }),
      categories: this.categoryService.getCategories(),
    }).pipe(
      map(({ transactions, categories }) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyExpenses = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.type === TransactionType.EXPENSE &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        });

        const categorySpendingMap = new Map<string, number>();
        const categoryCountMap = new Map<string, number>();
        let uncategorizedSpending = 0;

        monthlyExpenses.forEach(transaction => {
          const amount = Number(transaction.amount);

          if (transaction.categoryId) {
            const currentAmount =
              categorySpendingMap.get(transaction.categoryId) || 0;
            const currentCount =
              categoryCountMap.get(transaction.categoryId) || 0;
            categorySpendingMap.set(
              transaction.categoryId,
              currentAmount + amount
            );
            categoryCountMap.set(transaction.categoryId, currentCount + 1);
          } else {
            uncategorizedSpending += amount;
          }
        });

        const totalCategorizedSpending = Array.from(
          categorySpendingMap.values()
        ).reduce((sum, amount) => sum + amount, 0);

        const totalSpending = totalCategorizedSpending + uncategorizedSpending;

        const topCategories: CategorySpending[] = Array.from(
          categorySpendingMap.entries()
        )
          .map(([categoryId, amount]) => {
            const category = categories.find(c => c.id === categoryId);
            return {
              categoryId,
              categoryName: category?.name || 'Unknown',
              categoryIcon: category?.icon || 'help',
              categoryColor: category?.color || '#666',
              amount,
              percentage:
                totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
              transactionCount: categoryCountMap.get(categoryId) || 0,
            };
          })
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        return {
          topCategories,
          totalCategorizedSpending,
          uncategorizedSpending,
        };
      })
    );
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return this.transactionService.getTransactions({ limit: 5 });
  }

  generateCategoryChartData(
    categoryAnalytics: CategoryAnalytics
  ): ChartConfiguration['data'] {
    const labels = categoryAnalytics.topCategories.map(c => c.categoryName);
    const data = categoryAnalytics.topCategories.map(c => c.amount);
    const colors = categoryAnalytics.topCategories.map(c => c.categoryColor);

    if (categoryAnalytics.uncategorizedSpending > 0) {
      labels.push('Uncategorized');
      data.push(categoryAnalytics.uncategorizedSpending);
      colors.push('#999999');
    }

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '80'),
          borderWidth: 2,
          hoverBackgroundColor: colors.map(color => color + 'CC'),
          hoverBorderColor: colors,
          hoverBorderWidth: 3,
        },
      ],
    };
  }

  getBudgetSummary(): Observable<BudgetSummary> {
    return this.budgetService.getBudgetAnalytics().pipe(
      map(budgets => {
        const totalBudgets = budgets.length;
        const activeBudgets = budgets.filter(b => {
          const now = new Date();
          const startDate = new Date(b.startDate);
          const endDate = new Date(b.endDate);

          return now >= startDate && now <= endDate;
        }).length;

        const budgetsOnTrack = budgets.filter(
          b => b.status === 'ON_TRACK'
        ).length;
        const budgetsExceeded = budgets.filter(
          b => b.status === 'EXCEEDED'
        ).length;

        const totalBudgetAmount = budgets.reduce(
          (sum, b) => sum + Number(b.amount),
          0
        );
        const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

        return {
          totalBudgets,
          activeBudgets,
          budgetsExceeded,
          budgetsOnTrack,
          totalBudgetAmount,
          totalSpent,
        };
      })
    );
  }
}
