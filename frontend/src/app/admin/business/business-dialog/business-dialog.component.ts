import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../../core/services/file.service';
import { IFileResponse } from '../../../core/interfaces/file-response';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { API_IMG_URL } from '../../../core/constants/api-url';
import { BusinessService } from '../../../core/services/business.service';
import { IUpdateBusinessDto } from '../../../core/dto/business/update-business.dto';
import { ICreateBusinessDto } from '../../../core/dto/business/create-business.dto';

@Component({
  standalone: true,
  selector: 'app-business-dialog',
  templateUrl: './business-dialog.component.html',
  styleUrls: ['./business-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class BusinessDialogComponent {
  businessForm: FormGroup;
  selectedFile: File[] = [];
  preview_images_url: string[] = [];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private fileService: FileService,
    public dialogRef: MatDialogRef<BusinessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.businessForm = this.fb.group({
      company_name: [data.business?.company_name || '', Validators.required],
      company_description: [data.business?.company_description || '', [Validators.required]],
      city_id: [data.business?.city_id || 0, [Validators.required]],
      place: [data.business?.place || '', [Validators.required]],
      preview_images_url: [data.business?.preview_images_url || []],
    });

    // Если у пользователя уже есть аватар, показать превью
    if (data.business?.preview_images_url) {
      for (const el of data.business?.preview_images_url) {
        const url = `${API_IMG_URL}/${el}`
        this.preview_images_url?.push(url)
      }
    }
  }

  // Метод для обработки выбора файла
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      for (const el of fileInput.files) {
        this.selectedFile?.push(el)
      }

      if (this.selectedFile) {
        const readers = [];
        for (const file of this.selectedFile) {
          const reader = new FileReader();

          readers.push(new Promise<void>((resolve) => {
            reader.onload = (e) => {
              const el = e.target?.result as string;
              this.preview_images_url.push(el);
              resolve(); // Ждём, пока загрузится
            };
          }));

          reader.readAsDataURL(file);
        }
      }

    }
  }

  // Метод сохранения пользователя
  saveBusiness(): void {
    if (this.businessForm.invalid) return;

    const businessData = this.businessForm.value;

    if (this.selectedFile) {
      // Если есть новый аватар, сначала загружаем его
      this.fileService.uploadMultiple(this.selectedFile).subscribe({
        next: (res: IFileResponse[]) => {
          if (res.length > 0) {
            for (const el of res) {
              businessData.preview_images_url.push(el.url)
            }
          }
          this.saveOrUpdateUser(businessData);
        },
        error: (err) => {
          console.error('Ошибка загрузки файла:', err);
        }
      });
    } else {
      this.saveOrUpdateUser(businessData);
    }
  }

  private saveOrUpdateUser(businessData: any): void {
    if (this.data.business) {
      const dto: IUpdateBusinessDto = {
        company_name: businessData.company_name,
        company_description: businessData.company_description,
        preview_images_url: businessData.preview_images_url,
        city_id: businessData.city_id,
        place: businessData.place,
      }
      this.businessService.updateBusiness(this.data.business.id, dto).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateBusinessDto = {
        company_name: businessData.company_name,
        company_description: businessData.company_description,
        preview_images_url: businessData.preview_images_url,
        city_id: businessData.city_id,
        place: businessData.place,
      }
      this.businessService.createBusiness(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
