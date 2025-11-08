import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          ),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import(
            './features/accounts/account-list/account-list.component'
          ).then(m => m.AccountListComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import(
            './features/transactions/transaction-list/transaction-list.component'
          ).then(m => m.TransactionListComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './features/categories/category-list/category-list.component'
          ).then(m => m.CategoryListComponent),
      },
      {
        path: 'budgets',
        loadComponent: () =>
          import('./features/budgets/budget-list/budget-list.component').then(
            m => m.BudgetListComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then(
            m => m.AnalyticsComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
