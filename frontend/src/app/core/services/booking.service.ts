import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBooking } from "../interfaces/booking.interface";
import { ICreateBookingDto } from "../dto/booking/create-booking.dto";
import { BaseResponse } from "../classes/base-response";
import { IUpdateBookingDto } from "../dto/booking/update-booking.dto";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${API_URL}/booking`;
  constructor(private http: HttpClient) { }

  getBookings(): Observable<BaseResponse<IBooking[]>> {
    return this.http.get<BaseResponse<IBooking[]>>(this.apiUrl)
  }

  getBookingById(id: number): Observable<BaseResponse<IBooking>> {
    return this.http.get<BaseResponse<IBooking>>(`${this.apiUrl}/${id}`)
  }

  getUserBookings(): Observable<BaseResponse<IBooking[]>> {
    return this.http.get<BaseResponse<IBooking[]>>(`${this.apiUrl}/find-by-user-id`)
  }

  getBookingsByBusinessId(businessId: number): Observable<BaseResponse<IBooking[]>> {
    return this.http.get<BaseResponse<IBooking[]>>(`${this.apiUrl}/find-by-business/${businessId}`)
  }

  createBooking(dto: ICreateBookingDto): Observable<BaseResponse<IBooking>> {
    return this.http.post<BaseResponse<IBooking>>(this.apiUrl, dto)
  }

  deleteBooking(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateBooking(dto: IUpdateBookingDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }

}
