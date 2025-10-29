import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  TotalBalanceResponse,
} from '../models/account.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  createAccount(account: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(
    id: string,
    account: UpdateAccountRequest
  ): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTotalBalance(): Observable<TotalBalanceResponse> {
    return this.http.get<TotalBalanceResponse>(`${this.apiUrl}/balance/total`);
  }
}
