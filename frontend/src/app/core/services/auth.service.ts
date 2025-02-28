import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { HttpClient } from "@angular/common/http";
import { IRegisterUserDto } from "../dto/auth/register-user.dto";
import { Observable } from "rxjs";
import { Tokens } from "../types/token.types";
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
  constructor(private http: HttpClient) { }

  register(dto: IRegisterUserDto): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/register`, dto)
  }

  login(dto: ILoginUserDto): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/login`, dto)
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, null)
  }

  refreshTokens(dto: IRefreshTokenDto): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/refresh`, dto)
  }

  sendVerificationCode(dto: ISendVerificationCodeDto): Observable<BaseResponse<void>> {
    return this.http.post<BaseResponse<void>>(`${this.apiUrl}/send-code`, dto)
  }

  verifyCode(dto: IVerifyVerificationCodeDto): Observable<BaseResponse<void>> {
    return this.http.post<BaseResponse<void>>(`${this.apiUrl}/verify-code`, dto)
  }
}
