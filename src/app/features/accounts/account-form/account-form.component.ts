import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../../../core/services/account.service';
import {
  Account,
  AccountType,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../../../core/models/account.models';

interface DialogData {
  mode: 'create' | 'edit';
  account?: Account;
}

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss',
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  loading: boolean = false;
  accountTypes = Object.values(AccountType);

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private dialogRef: MatDialogRef<AccountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.account) {
      this.accountForm.patchValue({
        name: this.data.account.name,
        type: this.data.account.type,
        balance: this.data.account.balance,
      });
    }
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.loading = true;

      if (this.data.mode === 'create') {
        this.createAccount();
      } else {
        this.updateAccount();
      }
    }
  }

  private createAccount(): void {
    const request: CreateAccountRequest = this.accountForm.value;

    this.accountService.createAccount(request).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private updateAccount(): void {
    const request: UpdateAccountRequest = this.accountForm.value;

    this.accountService
      .updateAccount(this.data.account!.id, request)
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
    this.dialogRef.close(false);
  }

  getAccountTypeLabel(type: AccountType): string {
    switch (type) {
      case AccountType.CHECKING:
        return 'Checking Account';
      case AccountType.SAVINGS:
        return 'Savings Account';
      case AccountType.CREDIT:
        return 'Credit Card';
      case AccountType.INVESTMENT:
        return 'Investment Account';
      default:
        return type;
    }
  }

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Edit Account' : 'Add New Account';
  }
}
