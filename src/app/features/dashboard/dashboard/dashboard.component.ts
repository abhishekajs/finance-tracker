import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import {
  DashboardService,
  DashboardStats,
  CategoryAnalytics,
} from '../../../core/services/dashboard.service';
import { User } from '../../../core/models/auth.models';
import { DASHBOARD_CHART_CONFIG } from '../config/chart.config';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransactionFormComponent } from '../../transactions/transaction-form/transaction-form.component';
import { Transaction } from '../../../core/models/transaction.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
    RouterModule,
    BaseChartDirective,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;
  stats: DashboardStats = {
    totalBalance: 0,
    totalAccounts: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
  };

  categoryAnalytics: CategoryAnalytics = {
    topCategories: [],
    totalCategorizedSpending: 0,
    uncategorizedSpending: 0,
  };

  chartType: ChartType = DASHBOARD_CHART_CONFIG.type;
  chartData: ChartConfiguration['data'] = { ...DASHBOARD_CHART_CONFIG.data };
  chartOptions: ChartConfiguration['options'] = DASHBOARD_CHART_CONFIG.options;

  recentTransactions: Transaction[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      stats: this.dashboardService.getDashboardStats(),
      transactions: this.dashboardService.getRecentTransactions(),
      categoryAnalytics: this.dashboardService.getCategoryAnalytics(),
    }).subscribe({
      next: data => {
        this.stats = data.stats;
        this.recentTransactions = data.transactions;
        this.categoryAnalytics = data.categoryAnalytics;
        this.updateChartWithRealData();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  updateChartWithRealData(): void {
    if (this.categoryAnalytics.topCategories.length > 0) {
      this.chartData = this.dashboardService.generateCategoryChartData(
        this.categoryAnalytics
      );
      this.chartOptions = DASHBOARD_CHART_CONFIG.options;
    }
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  openAddTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboardData();
      }
    });
  }

  getMonthName(): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[new Date().getMonth()];
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
