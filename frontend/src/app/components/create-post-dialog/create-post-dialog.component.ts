import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FileService } from '../../core/services/file.service';
import { PostService } from '../../core/services/post.service';
import { TagService } from '../../core/services/tag.service';
import { ITag } from '../../core/interfaces/tag.interface';
import { IFileResponse } from '../../core/interfaces/file-response';

@Component({
  selector: 'app-create-post-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent {
  form: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  tags: ITag[] = [];

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private postService: PostService,
    private tagService: TagService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { businessId: number }
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      tagsId: [[], Validators.required]
    });

    this.tagService.getTags().subscribe(res => {
      this.tags = res.data ?? [];
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createPost(): void {
    if (this.form.invalid || !this.selectedFile) return;

    this.isLoading = true;

    this.fileService.uploadFile(this.selectedFile).subscribe((uploaded: IFileResponse[]) => {
      const dto = {
        business_id: this.data.businessId,
        ...this.form.value,
        background_url: uploaded[0].url
      };

      this.postService.createPost(dto).subscribe(() => {
        this.snackBar.open('Пост успешно создан', 'Закрыть', { duration: 3000 });
        this.dialogRef.close(true);
      }).add(() => this.isLoading = false);
    });
  }
}
