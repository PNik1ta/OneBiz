import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../../core/services/file.service';
import { IFileResponse } from '../../../core/interfaces/file-response';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { API_IMG_URL } from '../../../core/constants/api-url';
import { PostService } from '../../../core/services/post.service';
import { IUpdatePostDto } from '../../../core/dto/post/update-post.dto';
import { ICreatePostDto } from '../../../core/dto/post/create-post.dto';

@Component({
  standalone: true,
  selector: 'app-user-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class PostDialogComponent {
  postForm: FormGroup;
  selectedFile: File | null = null;
  backgroundPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private fileService: FileService,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postForm = this.fb.group({
      business_id: [data.post?.business_id || 0, Validators.required],
      title: [data.post?.title || '', [Validators.required, Validators.email]],
      text: [data.post?.text || '', Validators.required],
      background_url: [data.post?.background_url || '', Validators.required],
      tagsId: [data.post?.tagsId || []]
    });

    // Если у пользователя уже есть аватар, показать превью
    if (data.post?.background_url) {
      this.backgroundPreview = `${API_IMG_URL}/${data.post.background_url}`;
    }
  }

  // Метод для обработки выбора файла
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Генерируем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Метод сохранения пользователя
  saveUser(): void {
    if (this.postForm.invalid) return;

    const postData = this.postForm.value;

    if (this.selectedFile) {
      // Если есть новый аватар, сначала загружаем его
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (res: IFileResponse[]) => {
          if (res.length > 0) {
            postData.background_url = res[0].url; // Сохраняем URL загруженного файла
          }
          this.saveOrUpdatePost(postData);
        },
        error: (err) => {
          console.error('Ошибка загрузки файла:', err);
        }
      });
    } else {
      this.saveOrUpdatePost(postData);
    }
  }

  private saveOrUpdatePost(postData: any): void {
    if (this.data.user) {
      const dto: IUpdatePostDto = {
        business_id: postData.business_id,
        title: postData.title,
        text: postData.text,
        background_url: postData.background_url,
        tagsId: postData.tagsId,
      }
      this.postService.updatePost(dto, this.data.post?.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreatePostDto = {
        business_id: postData.business_id,
        title: postData.title,
        text: postData.text,
        background_url: postData.background_url,
        tagsId: postData.tagsId,
      }
      this.postService.createPost(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
