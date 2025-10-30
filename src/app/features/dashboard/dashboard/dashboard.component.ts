import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import {
  DashboardService,
  DashboardStats,
} from '../../../core/services/dashboard.service';
import { User } from '../../../core/models/auth.models';
import { DASHBOARD_CHART_CONFIG } from '../config/chart.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    BaseChartDirective,
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

  // Chart Configuration (imported from config)
  chartType: ChartType = DASHBOARD_CHART_CONFIG.type;
  chartData: ChartConfiguration['data'] = DASHBOARD_CHART_CONFIG.data;
  chartOptions: ChartConfiguration['options'] = DASHBOARD_CHART_CONFIG.options;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.dashboardService.getDashboardStats().subscribe({
      next: stats => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  refreshChart(): void {
    this.chartData.datasets[0].data = this.dashboardService.generateChartData();
  }
}
