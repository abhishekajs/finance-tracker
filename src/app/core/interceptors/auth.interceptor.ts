import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 || error.status === 401) {
          if (req.url.includes('/auth/')) {
            return throwError(() => error);
          }

          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getAccessToken();
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              });
              return next(retryReq);
            }),
            catchError(() => {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
