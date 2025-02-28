import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { ILike } from "../interfaces/like.interface";
import { ICreateLikeDto } from "../dto/like/create-like.dto";

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = `${API_URL}/like`;
  constructor(private http: HttpClient) { }

  getLikes(): Observable<BaseResponse<ILike[]>> {
    return this.http.get<BaseResponse<ILike[]>>(this.apiUrl)
  }

  getLikeById(id: number): Observable<BaseResponse<ILike>> {
    return this.http.get<BaseResponse<ILike>>(`${this.apiUrl}/${id}`)
  }

  getLikeByUserId(): Observable<BaseResponse<ILike[]>> {
    return this.http.get<BaseResponse<ILike[]>>(`${this.apiUrl}/find-by-user-id`)
  }

  createLike(dto: ICreateLikeDto): Observable<BaseResponse<ILike>> {
    return this.http.post<BaseResponse<ILike>>(this.apiUrl, dto)
  }

  deleteLike(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }
}
