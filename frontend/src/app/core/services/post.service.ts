import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { IPost } from "../interfaces/post.interface";
import { ICreatePostDto } from "../dto/post/create-post.dto";
import { IUpdatePostDto } from "../dto/post/update-post.dto";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${API_URL}/post`;
  constructor(private http: HttpClient) { }

  getPosts(): Observable<BaseResponse<IPost[]>> {
    return this.http.get<BaseResponse<IPost[]>>(this.apiUrl)
  }

  getPostById(id: number): Observable<BaseResponse<IPost>> {
    return this.http.get<BaseResponse<IPost>>(`${this.apiUrl}/${id}`)
  }

  getPostByBusinessId(businessId: number): Observable<BaseResponse<IPost[]>>{
    return this.http.get<BaseResponse<IPost[]>>(`${this.apiUrl}/find-by-business-id/${businessId}`)
  }

  createPost(dto: ICreatePostDto): Observable<BaseResponse<IPost>> {
    return this.http.post<BaseResponse<IPost>>(this.apiUrl, dto)
  }

  deletePost(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updatePost(dto: IUpdatePostDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
