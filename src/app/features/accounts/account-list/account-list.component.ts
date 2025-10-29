import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountService } from '../../../core/services/account.service';
import { Account, AccountType } from '../../../core/models/account.models';
import { AccountFormComponent } from '../account-form/account-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  displayedColumns: string[] = ['name', 'type', 'balance', 'actions'];
  loading: boolean = false;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAccounts().subscribe({
      next: accounts => {
        this.accounts = accounts;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  openEditDialog(account: Account): void {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      width: '500px',
      data: { mode: 'edit', account },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  deleteAccount(account: Account): void {
    if (confirm(`Are you sure you want to delete ${account.name}?`)) {
      this.accountService.deleteAccount(account.id).subscribe({
        next: () => {
          this.loadAccounts();
        },
      });
    }
  }

  getAccountTypeIcon(type: AccountType): string {
    switch (type) {
      case AccountType.CHECKING:
        return 'account_balance';
      case AccountType.SAVINGS:
        return 'savings';
      case AccountType.CREDIT:
        return 'credit_card';
      case AccountType.INVESTMENT:
        return 'trending_up';
      default:
        return 'account_balance_wallet';
    }
  }
}
