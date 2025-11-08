import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SpendingTrend,
  CategoryTrend,
  IncomeVsExpense,
  FinancialSummary,
  AnalyticsFilters,
} from '../models/analytics.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSpendingTrends(filters?: AnalyticsFilters): Observable<SpendingTrend[]> {
    let params = new HttpParams();
    if (filters?.months) {
      params = params.set('months', filters.months.toString());
    }
    return this.http.get<SpendingTrend[]>(`${this.apiUrl}/spending-trends`, {
      params,
    });
  }

  getCategoryTrends(filters?: AnalyticsFilters): Observable<CategoryTrend[]> {
    let params = new HttpParams();
    if (filters?.months) {
      params = params.set('months', filters.months.toString());
    }
    return this.http.get<CategoryTrend[]>(`${this.apiUrl}/category-trends`, {
      params,
    });
  }

  getIncomeVsExpense(
    filters?: AnalyticsFilters
  ): Observable<IncomeVsExpense[]> {
    let params = new HttpParams();
    if (filters?.period) {
      params = params.set('period', filters.period);
    }
    if (filters?.months) {
      params = params.set('months', filters.months.toString());
    }
    return this.http.get<IncomeVsExpense[]>(
      `${this.apiUrl}/income-vs-expense`,
      { params }
    );
  }

  getFinancialSummary(
    filters?: AnalyticsFilters
  ): Observable<FinancialSummary> {
    let params = new HttpParams();
    if (filters?.months) {
      params = params.set('months', filters.months.toString());
    }
    return this.http.get<FinancialSummary>(`${this.apiUrl}/summary`, {
      params,
    });
  }
}
