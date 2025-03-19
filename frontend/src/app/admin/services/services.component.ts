import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from '../../core/interfaces/user.interface';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { IService } from '../../core/interfaces/service.interface';
import { ServiceService } from '../../core/services/service.service';
import { ServiceDialogComponent } from './services-dialog/services-dialog.component';

@Component({
  standalone: true,
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class ServicesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'amount', 'business_id', 'discount', 'actions'];
  dataSource = new MatTableDataSource<IService>([]);

  constructor(private serviceService: ServiceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe(services => {
      this.dataSource.data = services.data ?? [];
    });
  }

  addService(): void {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '400px',
      data: { service: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadServices();
    });
  }

  editService(service: IUser): void {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '400px',
      data: { service },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadServices();
    });
  }

  deleteService(id: number): void {
    if (confirm('Удалить сервис?')) {
      this.serviceService.deleteService(id).subscribe(() => this.loadServices());
    }
  }
}
