import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { IBusiness } from '../../core/interfaces/business.interface';
import { BusinessService } from '../../core/services/business.service';
import { BusinessDialogComponent } from './business-dialog/business-dialog.component';

@Component({
  standalone: true,
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class BusinessesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'company_name', 'company_description', 'user_id', 'city_id', 'place', 'actions'];
  dataSource = new MatTableDataSource<IBusiness>([]);

  constructor(private businessService: BusinessService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  loadBusinesses(): void {
    this.businessService.getBusinesses().subscribe(businesses => {
      this.dataSource.data = businesses.data ?? [];
    });
  }

  addBusiness(): void {
    const dialogRef = this.dialog.open(BusinessDialogComponent, {
      width: '400px',
      data: { business: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBusinesses();
    });
  }

  editBusiness(business: IBusiness): void {
    const dialogRef = this.dialog.open(BusinessDialogComponent, {
      width: '400px',
      data: { business },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBusinesses();
    });
  }

  deleteBusiness(id: number): void {
    if (confirm('Удалить бизнес?')) {
      this.businessService.deleteBusiness(id).subscribe(() => this.loadBusinesses());
    }
  }
}
