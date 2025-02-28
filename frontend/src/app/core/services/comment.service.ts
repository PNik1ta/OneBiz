import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { BaseResponse } from "../classes/base-response";
import { IComment } from "../interfaces/comment.interface";
import { ICreateCommentDto } from "../dto/comment/create-comment.dto";
import { IUpdateCommentDto } from "../dto/comment/update-comment.dto";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${API_URL}/comment`;
  constructor(private http: HttpClient) { }

  getComments(): Observable<BaseResponse<IComment[]>> {
    return this.http.get<BaseResponse<IComment[]>>(this.apiUrl)
  }

  getCommentById(id: number): Observable<BaseResponse<IComment>> {
    return this.http.get<BaseResponse<IComment>>(`${this.apiUrl}/${id}`)
  }

  getCommentByPostId(postId: number): Observable<BaseResponse<IComment[]>> {
    return this.http.get<BaseResponse<IComment[]>>(`${this.apiUrl}/find-by-post-id/${postId}`)
  }

  createComment(dto: ICreateCommentDto): Observable<BaseResponse<IComment>> {
    return this.http.post<BaseResponse<IComment>>(this.apiUrl, dto)
  }

  deleteComment(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.apiUrl}/${id}`)
  }

  updateComment(dto: IUpdateCommentDto, id: number): Observable<BaseResponse<void>> {
    return this.http.put<BaseResponse<void>>(`${this.apiUrl}/${id}`, dto)
  }
}
