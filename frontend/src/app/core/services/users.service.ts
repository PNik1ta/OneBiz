import { Injectable } from '@angular/core';
import { API_URL } from '../constants/api-url';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICreateUserDto } from '../dto/user/create-user.dto';
import { IUpdateUserDto } from '../dto/user/update-user.dto';
import { BaseResponse } from '../classes/base-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${API_URL}/user`;
  constructor(private http: HttpClient) { }
  private userUpdated$ = new BehaviorSubject<void>(undefined);

  emitUserUpdated() {
    this.userUpdated$.next();
  }

  get userUpdatedObservable() {
    return this.userUpdated$.asObservable();
  }

  getUsers(): Observable<BaseResponse<IUser[]>> {
    return this.http.get<BaseResponse<IUser[]>>(this.apiUrl);
  }

  getUser(id: number): Observable<BaseResponse<IUser>> {
    return this.http.get<BaseResponse<IUser>>(`${this.apiUrl}/${id}`);
  }

  getProfile(): Observable<BaseResponse<IUser>> {
    return this.http.get<BaseResponse<IUser>>(`${this.apiUrl}/get-profile`)
  }

  getByEmail(email: string): Observable<BaseResponse<IUser>> {
    return this.http.get<BaseResponse<IUser>>(`${this.apiUrl}/find-by-email/${email}`)
  }

  createUser(dto: ICreateUserDto): Observable<BaseResponse<IUser>> {
    return this.http.post<BaseResponse<IUser>>(this.apiUrl, dto);
  }

  updateUser(dto: IUpdateUserDto): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/update-info`, dto);
  }

  deleteUser(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
