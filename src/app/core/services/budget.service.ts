import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Budget,
  BudgetAnalytics,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from '../models/budget.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  getBudgetAnalytics(): Observable<BudgetAnalytics[]> {
    return this.http.get<BudgetAnalytics[]>(`${this.apiUrl}/analytics`);
  }

  getActiveBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/active`);
  }

  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  createBudget(budget: CreateBudgetRequest): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  updateBudget(id: string, budget: UpdateBudgetRequest): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
