import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BudgetService } from '../../../core/services/budget.service';
import {
  BudgetAnalytics,
  BUDGET_STATUS_COLORS,
  BUDGET_PERIOD_LABELS,
} from '../../../core/models/budget.models';
import { BudgetFormComponent } from '../budget-form/budget-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent implements OnInit {
  budgets: BudgetAnalytics[] = [];
  displayedColumns: string[] = [
    'name',
    'category',
    'period',
    'amount',
    'progress',
    'status',
    'actions',
  ];

  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.budgetService.getBudgetAnalytics().subscribe({
      next: budgets => {
        this.budgets = budgets;
      },
      error: () => {
        this.snackBar.open('Failed to load budgets', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  openBudgetForm(budget?: BudgetAnalytics) {
    const dialogRef = this.dialog.open(BudgetFormComponent, {
      width: '500px',
      data: budget,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBudgets();
      }
    });
  }

  deleteBudget(budget: BudgetAnalytics) {
    if (confirm(`Delete budget "${budget.name}"?`)) {
      this.budgetService.deleteBudget(budget.id).subscribe({
        next: () => {
          this.snackBar.open('Budget deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadBudgets();
        },
        error: () => {
          this.snackBar.open('Failed to delete budget', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  getStatusColor(status: string): string {
    return (
      BUDGET_STATUS_COLORS[status as keyof typeof BUDGET_STATUS_COLORS] ||
      '#666'
    );
  }

  getPeriodLabel(period: string): string {
    return (
      BUDGET_PERIOD_LABELS[period as keyof typeof BUDGET_PERIOD_LABELS] ||
      period
    );
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
}
