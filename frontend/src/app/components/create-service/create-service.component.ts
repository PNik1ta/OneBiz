import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { IFileResponse } from '../../core/interfaces/file-response';
import { ITag } from '../../core/interfaces/tag.interface';
import { FileService } from '../../core/services/file.service';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { ServiceService } from '../../core/services/service.service';
import { ICreateServiceDto } from '../../core/dto/service/create-service.dto';

@Component({
  selector: 'app-create-service',
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
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent {
  form: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  tags: ITag[] = [];

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { businessId: number }
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      amount: [0, Validators.required],
      discount: [0]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createService(): void {
    if (this.form.invalid || !this.selectedFile) return;

    this.isLoading = true;

    this.fileService.uploadFile(this.selectedFile).subscribe((uploaded: IFileResponse[]) => {
      const dto: ICreateServiceDto = {
        ...this.form.value,
        background_url: uploaded[0].url
      };

      this.serviceService.createService(dto).subscribe(() => {
        this.snackBar.open('Сервис успешно создан', 'Закрыть', { duration: 3000 });
        this.dialogRef.close(true);
      }).add(() => this.isLoading = false);
    });
  }
}
