import { Injectable } from '@angular/core';
import { API_URL } from '../constants/api-url';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${API_URL}/users`
  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  // ✅ Получение одного пользователя
  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  // ✅ Создание пользователя
  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  // ✅ Обновление пользователя
  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${user.id}`, user);
  }

  // ✅ Удаление пользователя
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
