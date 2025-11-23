import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  darkMode = false;
  notifications = true;
  budgetAlerts = true;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  toggleTheme(): void {
    this.saveSettings();
    this.snackBar.open(
      `${this.darkMode ? 'Dark' : 'Light'} mode enabled`,
      'Close',
      { duration: 2000 }
    );
  }

  toggleNotifications(): void {
    this.saveSettings();
    this.snackBar.open(
      `Notifications ${this.notifications ? 'enabled' : 'disabled'}`,
      'Close',
      { duration: 2000 }
    );
  }

  toggleEmailAlerts(): void {
    this.saveSettings();
  }

  toggleBudgetAlerts(): void {
    this.saveSettings();
  }

  private loadSettings(): void {
    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.darkMode = parsed.darkMode || false;
      this.notifications = parsed.notifications || true;
      this.budgetAlerts = parsed.budgetAlerts || true;
    }
  }

  private saveSettings(): void {
    const settings = {
      darkMode: this.darkMode,
      notifications: this.notifications,
      budgetAlerts: this.budgetAlerts,
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }
}
