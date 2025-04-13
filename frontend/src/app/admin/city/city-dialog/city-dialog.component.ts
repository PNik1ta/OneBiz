import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { CityService } from '../../../core/services/city.service';
import { IUpdateCityDto } from '../../../core/dto/city/update-city.dto';
import { ICreateCityDto } from '../../../core/dto/city/create-city.dto';

@Component({
  standalone: true,
  selector: 'app-city-dialog',
  templateUrl: './city-dialog.component.html',
  styleUrls: ['./city-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class CityDialogComponent {
  cityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    public dialogRef: MatDialogRef<CityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cityForm = this.fb.group({
      name: [data.city?.name || '', Validators.required]
    });
  }

  // Метод сохранения пользователя
  saveCity(): void {
    if (this.cityForm.invalid) return;

    const cityData = this.cityForm.value;
    this.saveOrUpdateCity(cityData)
  }

  private saveOrUpdateCity(cityData: any): void {
    if (this.data.city) {
      const dto: IUpdateCityDto = {
        name: cityData.name,
      }
      this.cityService.updateCity(dto, this.data.city.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateCityDto = {
        name: cityData.name,
      }
      this.cityService.createCity(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
