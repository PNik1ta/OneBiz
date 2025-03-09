import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Tokens } from "../types/token.types";
import { IRegisterUserDto } from "../dto/auth/register-user.dto";
import { ILoginUserDto } from "../dto/auth/login-user.dto";
import { IRefreshTokenDto } from "../dto/auth/refresh-token.dto";
import { ISendVerificationCodeDto } from "../dto/auth/send-verification-code.dto";
import { BaseResponse } from "../classes/base-response";
import { IVerifyVerificationCodeDto } from "../dto/auth/verify-verification-code.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_URL}/auth`;
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient) {}

  register(dto: IRegisterUserDto): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/register`, dto).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  login(dto: ILoginUserDto): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/login`, dto).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, null).pipe(
      tap(() => this.clearTokens())
    );
  }

  refreshTokens(dto: IRefreshTokenDto): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/refresh`, dto).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  sendVerificationCode(dto: ISendVerificationCodeDto): Observable<BaseResponse<void>> {
    return this.http.post<BaseResponse<void>>(`${this.apiUrl}/send-code`, dto);
  }

  verifyCode(dto: IVerifyVerificationCodeDto): Observable<BaseResponse<void>> {
    return this.http.post<BaseResponse<void>>(`${this.apiUrl}/verify-code`, dto);
  }

  // Методы работы с токенами
  storeTokens(tokens: Tokens): void {
    localStorage.setItem(this.accessTokenKey, tokens.access_token);
    localStorage.setItem(this.refreshTokenKey, tokens.refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
