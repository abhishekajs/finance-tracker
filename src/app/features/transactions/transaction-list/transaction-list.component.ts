import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.models';
import {
  Transaction,
  TransactionType,
} from '../../../core/models/transaction.models';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: Category[] = [];
  loading: boolean = false;
  selectedCategoryId: string = '';

  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'account',
    'type',
    'amount',
    'actions',
  ];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
    });
  }

  loadTransactions(): void {
    this.loading = true;
    const filters = {
      limit: 50,
      category: this.selectedCategoryId || undefined,
    };

    this.transactionService.getTransactions(filters).subscribe({
      next: transactions => {
        this.transactions = transactions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onCategoryFilterChange(): void {
    this.loadTransactions();
  }

  getCategoryById(categoryId: string | undefined): Category | undefined {
    if (!categoryId) return undefined;
    return this.categories.find(cat => cat.id === categoryId);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  openEditDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      data: { mode: 'edit', transaction },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  deleteTransaction(transaction: Transaction): void {
    if (
      confirm(
        `Are you sure you want to delete this transaction: ${transaction.description}?`
      )
    ) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: () => {
          this.loadTransactions();
        },
      });
    }
  }

  getTransactionTypeColor(type: TransactionType): string {
    switch (type) {
      case TransactionType.INCOME:
        return 'primary';
      case TransactionType.EXPENSE:
        return 'warn';
      case TransactionType.TRANSFER:
        return 'accent';
      default:
        return '';
    }
  }

  getTransactionIcon(type: TransactionType): string {
    switch (type) {
      case TransactionType.INCOME:
        return 'trending_up';
      case TransactionType.EXPENSE:
        return 'trending_down';
      case TransactionType.TRANSFER:
        return 'swap_horiz';
      default:
        return 'receipt';
    }
  }

  formatAmount(amount: number, type: TransactionType): string {
    const prefix = type === TransactionType.INCOME ? '+' : '-';
    return `${prefix}₹${Math.abs(amount).toLocaleString()}`;
  }

  getSelectedFilterCategoryColor(): string {
    const category = this.categories.find(
      c => c.id === this.selectedCategoryId
    );
    return category?.color || '#666';
  }

  getSelectedFilterCategoryIcon(): string {
    const category = this.categories.find(
      c => c.id === this.selectedCategoryId
    );
    return category?.icon || 'label';
  }

  getSelectedFilterCategoryName(): string {
    const category = this.categories.find(
      c => c.id === this.selectedCategoryId
    );
    return category?.name || '';
  }
}
