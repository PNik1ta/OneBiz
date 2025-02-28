import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { IService } from "../interfaces/service.interface";
import { ICreateServiceDto } from "../dto/service/create-service.dto";
import { IUpdateServiceDto } from "../dto/service/update-service.dto";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${API_URL}/service`;
  constructor(private http: HttpClient) { }

  getServices(): Observable<BaseResponse<IService[]>> {
    return this.http.get<BaseResponse<IService[]>>(this.apiUrl)
  }

  getServiceById(id: number): Observable<BaseResponse<IService>> {
    return this.http.get<BaseResponse<IService>>(`${this.apiUrl}/${id}`)
  }

  getServiceByBusinessId(businessId: number): Observable<BaseResponse<IService[]>> {
    return this.http.get<BaseResponse<IService[]>>(`${this.apiUrl}/find-by-business/${businessId}`)
  }

  createService(dto: ICreateServiceDto): Observable<BaseResponse<IService>> {
    return this.http.post<BaseResponse<IService>>(this.apiUrl, dto)
  }

  deleteService(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateService(dto: IUpdateServiceDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
