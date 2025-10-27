import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEYS = environment.storageKeys;

  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // Register new user
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, request)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  // Login user
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  // Refresh access token
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http
      .post<RefreshTokenResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem(
            this.STORAGE_KEYS.accessToken,
            response.accessToken
          );
        })
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.accessToken);
    localStorage.removeItem(this.STORAGE_KEYS.refreshToken);
    localStorage.removeItem(this.STORAGE_KEYS.user);
    this.currentUserSubject.next(null);
  }

  // get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.accessToken);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.refreshToken);
  }

  // Handle successful authentication
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.STORAGE_KEYS.accessToken, response.accessToken);
    localStorage.setItem(this.STORAGE_KEYS.refreshToken, response.refreshToken);
    localStorage.setItem(this.STORAGE_KEYS.user, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  // Load user from localStorage on app start
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.STORAGE_KEYS.user);
    if (userJson && this.getAccessToken()) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }
}
