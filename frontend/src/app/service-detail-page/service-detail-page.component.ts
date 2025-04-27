import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IService } from '../core/interfaces/service.interface';
import { API_IMG_URL } from '../core/constants/api-url';
import { ServiceService } from '../core/services/service.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from '../components/booking-dialog/booking-dialog.component';
import { ButtonComponent } from "../components/button/button.component";
import * as AOS from 'aos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-service-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonComponent, MatProgressSpinnerModule],
  templateUrl: './service-detail-page.component.html',
  styleUrls: ['./service-detail-page.component.scss']
})
export class ServiceDetailPageComponent implements OnInit {
  service: IService | null = null;
  API_IMG_URL = API_IMG_URL;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.serviceService.getServiceById(id).subscribe(res => {
        this.service = res.data ?? null;
        this.isLoading = false;
      });
    }

    AOS.init({
      duration: 800,
      once: false,
    });
  }

  openBookingDialog() {
    this.dialog.open(BookingDialogComponent, {
      data: {
        serviceId: this.service!.id,
        businessId: this.service!.business_id
      }
    });
  }

  onBookClick(): void {
    // логика позже
    console.log('Клик по кнопке "Записаться"');
  }
}
