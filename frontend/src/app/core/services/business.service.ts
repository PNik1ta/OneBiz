import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { IBusiness } from "../interfaces/business.interface";
import { ICreateBookingDto } from "../dto/booking/create-booking.dto";
import { IUpdateBusinessDto } from "../dto/business/update-business.dto";
import { ICreateBusinessDto } from "../dto/business/create-business.dto";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = `${API_URL}/business`;
  constructor(private http: HttpClient) { }

  getBusinesses(): Observable<BaseResponse<IBusiness[]>> {
    return this.http.get<BaseResponse<IBusiness[]>>(this.apiUrl)
  }

  getBusinessById(id: number): Observable<BaseResponse<IBusiness>> {
    return this.http.get<BaseResponse<IBusiness>>(`${this.apiUrl}/${id}`)
  }

  createBusiness(dto: ICreateBusinessDto): Observable<BaseResponse<IBusiness>> {
    return this.http.post<BaseResponse<IBusiness>>(this.apiUrl, dto)
  }

  deleteBusiness(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateBusiness(id: number, dto: IUpdateBusinessDto): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
