import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BudgetService } from '../../../core/services/budget.service';
import { CategoryService } from '../../../core/services/category.service';
import {
  Budget,
  BudgetPeriod,
  BUDGET_PERIOD_LABELS,
} from '../../../core/models/budget.models';
import { Category } from '../../../core/models/category.models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.scss',
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  isEditMode = false;
  categories: Category[] = [];
  budgetPeriods = Object.entries(BUDGET_PERIOD_LABELS);

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BudgetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Budget
  ) {
    this.isEditMode = !!data;
    this.budgetForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      amount: [
        data?.amount || '',
        [Validators.required, Validators.minLength(1)],
      ],
      period: [data?.period || BudgetPeriod.MONTHLY, Validators.required],
      startDate: [
        data?.startDate ? new Date(data.startDate) : new Date(),
        Validators.required,
      ],
      endDate: [
        data?.endDate ? new Date(data.endDate) : this.getDefaultEndDate(),
        Validators.required,
      ],
      categoryId: [data?.categoryId || ''],
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.setupPeriodChange();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: () => {
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  setupPeriodChange() {
    this.budgetForm.get('period')?.valueChanges.subscribe(period => {
      const startDate = this.budgetForm.get('startDate')?.value || new Date();
      this.budgetForm.patchValue({
        endDate: this.calculateEndDate(startDate, period),
      });
    });

    this.budgetForm.get('startDate')?.valueChanges.subscribe(startDate => {
      if (startDate) {
        const period = this.budgetForm.get('period')?.value;
        this.budgetForm.patchValue({
          endDate: this.calculateEndDate(startDate, period),
        });
      }
    });
  }

  calculateEndDate(startDate: Date, period: BudgetPeriod): Date {
    const date = new Date(startDate);
    switch (period) {
      case BudgetPeriod.WEEKLY:
        date.setDate(date.getDate() + 6);
        break;
      case BudgetPeriod.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        break;
      case BudgetPeriod.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1);
        break;
    }
    return date;
  }

  getDefaultEndDate(): Date {
    return this.calculateEndDate(new Date(), BudgetPeriod.MONTHLY);
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      const formData = {
        ...this.budgetForm.value,
        startDate: this.budgetForm.value.startDate.toISOString(),
        endDate: this.budgetForm.value.endDate.toISOString(),
        categoryId: this.budgetForm.value.categoryId || undefined,
      };

      if (this.isEditMode) {
        this.budgetService.updateBudget(this.data.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Budget updated successfully', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to update budget', 'Close', {
              duration: 3000,
            });
          },
        });
      } else {
        this.budgetService.createBudget(formData).subscribe({
          next: () => {
            this.snackBar.open('Budget created successfully', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to create budget', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
