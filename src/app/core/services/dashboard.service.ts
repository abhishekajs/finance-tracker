import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { CategoryService } from './category.service';
import { Transaction, TransactionType } from '../models/transaction.models';
import { Category } from '../models/category.models';

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

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.accountService.getAccounts().pipe(
      map(accounts => {
        const totalBalance = accounts.reduce(
          (sum, account) => sum + Number(account.balance),
          0
        );
        const totalAccounts = accounts.length;
        const monthlyIncome = 12500; // Placeholder
        const monthlyExpenses = 8750; // Placeholder
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

  // Method to refresh chart data with variations
  generateChartData(): number[] {
    const baseData = [3200, 1800, 2100, 800, 1500, 850];
    return baseData.map(value => value + Math.floor(Math.random() * 400) - 200);
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return this.transactionService.getTransactions({ limit: 5 });
  }
}
