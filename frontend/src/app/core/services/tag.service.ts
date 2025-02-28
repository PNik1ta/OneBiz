import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { ITag } from "../interfaces/tag.interface";
import { ICreateTagDto } from "../dto/tag/create-tag.dto";
import { IUpdateTagDto } from "../dto/tag/update-tag.dto";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${API_URL}/tag`;
  constructor(private http: HttpClient) { }

  getTags(): Observable<BaseResponse<ITag[]>> {
    return this.http.get<BaseResponse<ITag[]>>(this.apiUrl)
  }

  getTagById(id: number): Observable<BaseResponse<ITag>> {
    return this.http.get<BaseResponse<ITag>>(`${this.apiUrl}/${id}`)
  }

  createTag(dto: ICreateTagDto): Observable<BaseResponse<ITag>> {
    return this.http.post<BaseResponse<ITag>>(this.apiUrl, dto)
  }

  deleteTag(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateTag(dto: IUpdateTagDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
