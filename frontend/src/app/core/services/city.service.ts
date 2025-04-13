import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { ICity } from "../interfaces/city.interface";
import { IUpdateCityDto } from "../dto/city/update-city.dto";
import { ICreateCityDto } from "../dto/city/create-city.dto";

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = `${API_URL}/city`;
  constructor(private http: HttpClient) { }

  getCities(): Observable<BaseResponse<ICity[]>> {
    return this.http.get<BaseResponse<ICity[]>>(this.apiUrl)
  }

  getCityById(id: number): Observable<BaseResponse<ICity>> {
    return this.http.get<BaseResponse<ICity>>(`${this.apiUrl}/${id}`)
  }

  createCity(dto: ICreateCityDto): Observable<BaseResponse<ICity>> {
    return this.http.post<BaseResponse<ICity>>(this.apiUrl, dto)
  }

  deleteCity(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateCity(dto: IUpdateCityDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
