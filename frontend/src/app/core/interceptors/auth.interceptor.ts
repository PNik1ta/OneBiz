import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, router: Router): Observable<HttpEvent<any>> => {
  const refreshToken = authService.getRefreshToken();

  if (!refreshToken) {
    authService.clearTokens();
    router.navigate(['/login']);
    return throwError(() => new Error('No refresh token available'));
  }

  return authService.refreshTokens({ rt: refreshToken }).pipe(
    switchMap(tokens => {
      authService.storeTokens(tokens);

      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });

      return next(clonedReq);
    }),
    catchError(error => {
      authService.clearTokens();
      router.navigate(['/login']);
      return throwError(() => error);
    })
  );
};
