import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { AccountService } from '../../../core/services/account.service';
import {
  Transaction,
  TransactionType,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '../../../core/models/transaction.models';
import { Account } from '../../../core/models/account.models';
import { Category } from '../../../core/models/category.models';

interface DialogData {
  mode: 'create' | 'edit';
  transaction?: Transaction;
}

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  loading = false;
  accounts: Account[] = [];
  categories: Category[] = [];
  transactionTypes = Object.values(TransactionType);

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      accountId: ['', Validators.required],
      categoryId: [''],
      date: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCategories();

    if (this.data.mode === 'edit' && this.data.transaction) {
      this.transactionForm.patchValue({
        amount: this.data.transaction.amount,
        description: this.data.transaction.description,
        type: this.data.transaction.type,
        accountId: this.data.transaction.accountId,
        categoryId: this.data.transaction.categoryId || '',
        date: new Date(this.data.transaction.date),
      });
    }
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: accounts => {
        this.accounts = accounts;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createTransaction();
      } else {
        this.updateTransaction();
      }
    }
  }

  private createTransaction(): void {
    const formValue = this.transactionForm.value;
    const request: CreateTransactionRequest = {
      amount: parseFloat(formValue.amount),
      description: formValue.description,
      type: formValue.type,
      accountId: formValue.accountId,
      categoryId: formValue.categoryId || undefined,
      date: formValue.date.toISOString(),
    };

    this.transactionService.createTransaction(request).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private updateTransaction(): void {
    const formValue = this.transactionForm.value;
    const request: UpdateTransactionRequest = {
      amount: parseFloat(formValue.amount),
      description: formValue.description,
      type: formValue.type,
      accountId: formValue.accountId,
      categoryId: formValue.categoryId || undefined,
      date: formValue.date.toISOString(),
    };

    this.transactionService
      .updateTransaction(this.data.transaction!.id, request)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTransactionTypeLabel(type: TransactionType): string {
    switch (type) {
      case TransactionType.INCOME:
        return 'Income';
      case TransactionType.EXPENSE:
        return 'Expense';
      case TransactionType.TRANSFER:
        return 'Transfer';
      default:
        return type;
    }
  }

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Edit Transaction' : 'Add New Transaction';
  }

  getSelectedCategoryColor(): string {
    const categoryId = this.transactionForm.get('categoryId')?.value;
    const category = this.categories.find(c => c.id === categoryId);
    return category?.color || '#666';
  }

  getSelectedCategoryIcon(): string {
    const categoryId = this.transactionForm.get('categoryId')?.value;
    const category = this.categories.find(c => c.id === categoryId);
    return category?.icon || 'label';
  }

  getSelectedCategoryName(): string {
    const categoryId = this.transactionForm.get('categoryId')?.value;
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || '';
  }
}
