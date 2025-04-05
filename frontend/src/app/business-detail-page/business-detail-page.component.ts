import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IBusiness } from '../core/interfaces/business.interface';
import { IService } from '../core/interfaces/service.interface';
import { BusinessService } from '../core/services/business.service';
import { ServiceService } from '../core/services/service.service';
import { API_IMG_URL } from '../core/constants/api-url';
import { ServiceCardComponent } from '../components/service-card/service-card.component';

@Component({
  selector: 'app-business-detail-page',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './business-detail-page.component.html',
  styleUrl: './business-detail-page.component.scss'
})
export class BusinessDetailPageComponent implements OnInit {
  businessId: number = 0;
  business: IBusiness | null = null;
  services: IService[] = [];
  API_IMG_URL=API_IMG_URL

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private serviceService: ServiceService,
  ) {}

  ngOnInit(): void {
    this.businessId = +this.route.snapshot.paramMap.get('id')!;

    this.businessService.getBusinessById(this.businessId).subscribe(res => {
      this.business = res.data ?? null;
    });

    this.serviceService.getServiceByBusinessId(this.businessId).subscribe(res => {
      this.services = res.data ?? [];
    });
  }
}
