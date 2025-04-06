import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IService } from '../../core/interfaces/service.interface';
import { API_IMG_URL } from '../../core/constants/api-url';
import { IBusiness } from '../../core/interfaces/business.interface';
import { BusinessService } from '../../core/services/business.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnInit {
  @Input() service!: IService;
  @Input() isWithBusinessInfo: boolean = false;
  business: IBusiness | null = null;
  API_IMG_URL = API_IMG_URL;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    if (this.isWithBusinessInfo) {
      this.businessService.getBusinessById(this.service.business_id).subscribe(res => {
        this.business = res.data ?? null;
      });
    }
  }
}
