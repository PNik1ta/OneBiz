import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ITag } from '../../core/interfaces/tag.interface';
import { TagService } from '../../core/services/tag.service';
import { ICity } from '../../core/interfaces/city.interface';
import { CityService } from '../../core/services/city.service';
import { CityDialogComponent } from './city-dialog/city-dialog.component';

@Component({
  standalone: true,
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class CityComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<ICity>([]);

  constructor(private cityService: CityService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities(): void {
    this.cityService.getCities().subscribe(cities => {
      this.dataSource.data = cities.data ?? [];
    });
  }

  addCity(): void {
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '400px',
      data: { city: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCities();
    });
  }

  editCity(city: ICity): void {
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '400px',
      data: { city },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCities();
    });
  }

  deleteCity(id: number): void {
    if (confirm('Удалить город?')) {
      this.cityService.deleteCity(id).subscribe(() => this.loadCities());
    }
  }
}
