import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { FileService } from '../../../core/services/file.service';
import { IFileResponse } from '../../../core/interfaces/file-response';
import { ICreateUserDto } from '../../../core/dto/user/create-user.dto';
import { IUpdateUserDto } from '../../../core/dto/user/update-user.dto';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { API_IMG_URL } from '../../../core/constants/api-url';
import { ServiceService } from '../../../core/services/service.service';
import { ICreateServiceDto } from '../../../core/dto/service/create-service.dto';
import { IUpdateServiceDto } from '../../../core/dto/service/update-service.dto';

@Component({
  standalone: true,
  selector: 'app-user-dialog',
  templateUrl: './services-dialog.component.html',
  styleUrls: ['./services-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class ServiceDialogComponent {
  serviceForm: FormGroup;
  selectedFile: File | null = null;
  backgroundPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private fileService: FileService,
    public dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.serviceForm = this.fb.group({
      title: [data.service?.title || '', Validators.required],
      description: [data.service?.description || '', [Validators.required]],
      background_url: [data.service?.background_url || '', Validators.required],
      amount: [data.service?.amount || 0, Validators.required],
      discount: [data.service?.discount || '']
    });

    // Если у пользователя уже есть аватар, показать превью
    if (data.service?.background_url) {
      this.backgroundPreview = `${API_IMG_URL}/${data.service.background_url}`;
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
  saveService(): void {
    if (this.serviceForm.invalid) return;

    const serviceData = this.serviceForm.value;

    if (this.selectedFile) {
      // Если есть новый аватар, сначала загружаем его
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (res: IFileResponse[]) => {
          if (res.length > 0) {
            serviceData.avatar_url = res[0].url; // Сохраняем URL загруженного файла
          }
          this.saveOrUpdateService(serviceData);
        },
        error: (err) => {
          console.error('Ошибка загрузки файла:', err);
        }
      });
    } else {
      this.saveOrUpdateService(serviceData);
    }
  }

  private saveOrUpdateService(serviceData: any): void {
    if (this.data.service) {
      const dto: IUpdateServiceDto = {
        title: serviceData.title,
        description: serviceData.description,
        amount: serviceData.amount,
        background_url: serviceData.background_url,
        discount: serviceData.discount,
      }
      this.serviceService.updateService(dto, this.data.service.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateServiceDto = {
        title: serviceData.title,
        description: serviceData.description,
        amount: serviceData.amount,
        background_url: serviceData.background_url,
        discount: serviceData.discount,
      }
      this.serviceService.createService(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
