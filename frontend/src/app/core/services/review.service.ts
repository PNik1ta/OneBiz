import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { IReview } from "../interfaces/review.interface";
import { ICreateReviewDto } from "../dto/review/create-review.dto";
import { IUpdateReviewDto } from "../dto/review/update-review.dto";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${API_URL}/review`;
  constructor(private http: HttpClient) { }

  getReviews(): Observable<BaseResponse<IReview[]>> {
    return this.http.get<BaseResponse<IReview[]>>(this.apiUrl)
  }

  getReviewById(id: number): Observable<BaseResponse<IReview>> {
    return this.http.get<BaseResponse<IReview>>(`${this.apiUrl}/${id}`)
  }

  getByBookingBusinessId(bookingBusinessId: number): Observable<BaseResponse<IReview[]>> {
    return this.http.get<BaseResponse<IReview[]>>(`${this.apiUrl}/find-by-booking-business/${bookingBusinessId}`)
  }

  createReview(dto: ICreateReviewDto): Observable<BaseResponse<IReview>> {
    return this.http.post<BaseResponse<IReview>>(this.apiUrl, dto)
  }

  deleteReview(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateReview(dto: IUpdateReviewDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
