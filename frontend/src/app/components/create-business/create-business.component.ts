import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusinessService } from '../../core/services/business.service';
import { FileService } from '../../core/services/file.service';
import { IFileResponse } from '../../core/interfaces/file-response';
import { CityService } from '../../core/services/city.service';
import { ICity } from '../../core/interfaces/city.interface';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-business',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-business.component.html',
  styleUrl: './create-business.component.scss'
})
export class CreateBusinessComponent {
  form: FormGroup;
  isLoading = false;
  selectedFiles: File[] = [];
  cities: ICity[] = [];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private fileService: FileService,
    private cityService: CityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateBusinessComponent>
  ) {
    this.form = this.fb.group({
      company_name: ['', Validators.required],
      company_description: ['', Validators.required],
      city_id: [0, Validators.required],
      place: ['', Validators.required]
    });

    this.cityService.getCities().subscribe((res) => {
      this.cities = res.data ?? [];
    })
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  createBusiness(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    const { company_name, company_description, city_id, place } = this.form.value;

    const upload$ = this.selectedFiles.length
      ? this.fileService.uploadMultiple(this.selectedFiles)
      : new Promise<IFileResponse[]>(resolve => resolve([] as IFileResponse[]));

    Promise.resolve(upload$).then(obs => {
      (obs as any).subscribe((uploadedFiles: IFileResponse[]) => {
        const imageUrls = uploadedFiles.map(file => file.url);
        const dto = {
          company_name,
          company_description,
          city_id,
          place,
          preview_images_url: imageUrls
        };

        this.businessService.createBusiness(dto).subscribe(() => {
          this.snackBar.open('Бизнес успешно создан', 'Закрыть', { duration: 3000 });
          this.dialogRef.close(true);
        }).add(() => {
          this.isLoading = false;
        });
      });
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
