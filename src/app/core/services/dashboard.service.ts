import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AccountService } from './account.service';

export interface DashboardStats {
  totalBalance: number;
  totalAccounts: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private accountService: AccountService) {}

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

  // Method to refresh chart data with variations
  generateChartData(): number[] {
    const baseData = [3200, 1800, 2100, 800, 1500, 850];
    return baseData.map(value => value + Math.floor(Math.random() * 400) - 200);
  }
}
