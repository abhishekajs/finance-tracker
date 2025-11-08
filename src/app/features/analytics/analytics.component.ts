import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { AnalyticsService } from '../../core/services/analytics.service';
import {
  SpendingTrend,
  CategoryTrend,
  IncomeVsExpense,
  FinancialSummary,
  TREND_COLORS,
  TREND_ICONS,
} from '../../core/models/analytics.models';
import {
  SPENDING_CHART_CONFIG,
  CATEGORY_CHART_CONFIG,
  INCOME_CHART_CONFIG,
  CHART_COLORS,
} from './config/chart.config';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    BaseChartDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    setTimeout(() => {
      this.refreshCharts();
    }, 100);
  }

  loading = true;

  spendingTrends: SpendingTrend[] = [];
  categoryTrends: CategoryTrend[] = [];
  incomeVsExpense: IncomeVsExpense[] = [];
  financialSummary: FinancialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    averageMonthlyIncome: 0,
    averageMonthlyExpenses: 0,
    savingsRate: 0,
    topExpenseCategory: '',
    topIncomeMonth: '',
    highestExpenseMonth: '',
  };

  monthsControl = new FormControl(12);
  periodControl = new FormControl<'monthly' | 'yearly'>('monthly');

  spendingChartType = SPENDING_CHART_CONFIG.type;
  spendingChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  spendingChartOptions = SPENDING_CHART_CONFIG.options;

  categoryChartType = CATEGORY_CHART_CONFIG.type;
  categoryChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  categoryChartOptions = CATEGORY_CHART_CONFIG.options;

  incomeChartType = INCOME_CHART_CONFIG.type;
  incomeChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  incomeChartOptions = INCOME_CHART_CONFIG.options;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAnalyticsData();
    this.setupFilterListeners();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.refreshCharts();
    }, 100);
  }

  setupFilterListeners() {
    this.monthsControl.valueChanges.subscribe(() => {
      this.loadAnalyticsData();
    });

    this.periodControl.valueChanges.subscribe(() => {
      this.loadAnalyticsData();
    });
  }

  loadAnalyticsData() {
    this.loading = true;
    const months = this.monthsControl.value || 12;
    const period = this.periodControl.value || 'monthly';

    console.log('Loading analytics data with:', { months, period }); // Debug log

    forkJoin({
      spendingTrends: this.analyticsService.getSpendingTrends({ months }),
      categoryTrends: this.analyticsService.getCategoryTrends({ months: 6 }),
      incomeVsExpense: this.analyticsService.getIncomeVsExpense({
        months,
        period,
      }),
      financialSummary: this.analyticsService.getFinancialSummary({ months }),
    }).subscribe({
      next: data => {
        console.log('Analytics data received:', data); // Debug log

        this.spendingTrends = data.spendingTrends;
        this.categoryTrends = data.categoryTrends;
        this.incomeVsExpense = data.incomeVsExpense;
        this.financialSummary = data.financialSummary;

        console.log('Spending trends:', this.spendingTrends); // Debug log
        console.log('Income vs expense:', this.incomeVsExpense); // Debug log

        this.updateCharts();
        this.loading = false;

        this.cdr.detectChanges();
        setTimeout(() => {
          this.refreshCharts();
        }, 50);
      },
      error: error => {
        console.error('Error loading analytics data:', error); // Debug log
        this.loading = false;
      },
    });
  }

  updateCharts() {
    this.updateSpendingChart();
    this.updateCategoryChart();
    this.updateIncomeChart();
  }

  updateSpendingChart() {
    const labels = this.spendingTrends.map(t => `${t.month} ${t.year}`);
    console.log('Updating spending chart with labels:', labels); // Debug log
    console.log('Spending trends data:', this.spendingTrends); // Debug log

    this.spendingChartData = {
      labels,
      datasets: [
        {
          label: 'Income',
          data: this.spendingTrends.map(t => t.income),
          borderColor: CHART_COLORS.income,
          backgroundColor: CHART_COLORS.income + '20',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Expenses',
          data: this.spendingTrends.map(t => t.expenses),
          borderColor: CHART_COLORS.expenses,
          backgroundColor: CHART_COLORS.expenses + '20',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Savings',
          data: this.spendingTrends.map(t => t.savings),
          borderColor: CHART_COLORS.savings,
          backgroundColor: CHART_COLORS.savings + '20',
          tension: 0.4,
          fill: false,
        },
      ],
    };

    console.log('Spending chart data:', this.spendingChartData); // Debug log
  }

  updateCategoryChart() {
    const topCategories = this.categoryTrends.slice(0, 6);

    this.categoryChartData = {
      labels: topCategories.map(c => c.categoryName),
      datasets: [
        {
          data: topCategories.map(c => c.totalAmount),
          backgroundColor: topCategories.map(c => c.categoryColor),
          borderColor: topCategories.map(c => c.categoryColor),
          borderWidth: 2,
        },
      ],
    };
  }

  updateIncomeChart() {
    const labels = this.incomeVsExpense.map(i => i.period);

    console.log('Updating income chart with labels:', labels); // Debug log
    console.log('Income vs expense data:', this.incomeVsExpense); // Debug log

    this.incomeChartData = {
      labels,
      datasets: [
        {
          label: 'Income',
          data: this.incomeVsExpense.map(i => i.income),
          backgroundColor: CHART_COLORS.income,
          borderColor: CHART_COLORS.income,
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: this.incomeVsExpense.map(i => i.expenses),
          backgroundColor: CHART_COLORS.expenses,
          borderColor: CHART_COLORS.expenses,
          borderWidth: 1,
        },
      ],
    };

    console.log('Income chart data:', this.incomeChartData); // Debug log
  }

  refreshCharts() {
    if (this.charts) {
      this.charts.forEach(chart => {
        if (chart.chart) {
          chart.chart.resize();
          chart.chart.update('none');
        }
      });
    }
  }

  getTrendColor(trend: string): string {
    return TREND_COLORS[trend as keyof typeof TREND_COLORS] || '#666';
  }

  getTrendIcon(trend: string): string {
    return TREND_ICONS[trend as keyof typeof TREND_ICONS] || 'help';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  refreshData() {
    this.loadAnalyticsData();
  }
}
