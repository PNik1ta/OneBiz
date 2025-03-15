import { Injectable } from "@angular/core";
import { API_URL } from "../constants/api-url";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IFileResponse } from "../interfaces/file-response";

@Injectable({ providedIn: 'root' })
export class FileService {
  private apiUrl = `${API_URL}/files`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<IFileResponse[]> {
    const formData = new FormData()
    formData.append('files', file)

    return this.http.post<IFileResponse[]>(`${this.apiUrl}/upload`, formData)
  }
}
