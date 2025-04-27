import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { IBusiness } from '../core/interfaces/business.interface';
import { IService } from '../core/interfaces/service.interface';
import { BusinessService } from '../core/services/business.service';
import { ServiceService } from '../core/services/service.service';
import { BusinessCardComponent } from '../components/business-card/business-card.component';
import { BusinessPageHeroComponent } from './components/business-page-hero/business-page-hero.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICity } from '../core/interfaces/city.interface';
import { CityService } from '../core/services/city.service';
import * as AOS from 'aos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getRussianPaginatorIntl } from '../core/utils/custom-paginator-intl';

@Component({
  selector: 'app-business-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    BusinessCardComponent,
    BusinessPageHeroComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './business-page.component.html',
  styleUrl: './business-page.component.scss',
  providers: [{ provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl() }]
})
export class BusinessPageComponent implements OnInit {
  allBusinesses: IBusiness[] = [];
  filteredBusinesses: IBusiness[] = [];
  allServices: IService[] = [];
  selectedServiceId: number | null = null;
  selectedCityId: number | null = null;
  searchTerm: string = '';
  allCities: ICity[] = [];
  isLoading: boolean = true;
  pageSize = 20;
  currentPage = 0;
  paginatedBusinesses: IBusiness[] = [];

  constructor(
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private cityService: CityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    Promise.all([
      this.businessService.getBusinesses().toPromise(),
      this.serviceService.getServices().toPromise(),
      this.cityService.getCities().toPromise()
    ]).then(([businessRes, serviceRes, cityRes]) => {
      this.allBusinesses = businessRes?.data ?? [];
      this.filteredBusinesses = businessRes?.data ?? [];
      this.allServices = serviceRes?.data ?? [];
      this.allCities = cityRes?.data ?? [];
      this.paginateBusinesses();
    }).finally(() => {
      this.isLoading = false;
    });

    AOS.init({
      duration: 800,
      once: false,
    });

  }

  searchBusinesses(): void {
    const serviceId = this.selectedServiceId;
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredBusinesses = this.allBusinesses.filter(business => {
      const matchesService = !serviceId || this.allServices.some(
        service => service.business_id === business.id && service.id === serviceId
      );

      const matchesSearch = business.company_name.toLowerCase().includes(term);

      return matchesService && matchesSearch;
    });
    this.paginateBusinesses()
  }


  filterBusinesses(): void {
    const filtered = this.allBusinesses.filter(business => {
      const matchesService = !this.selectedServiceId || this.allServices.some(
        service => service.business_id === business.id && service.id === this.selectedServiceId
      );
      const matchesCity = !this.selectedCityId || business.city_id === this.selectedCityId;
      return matchesService && matchesCity;
    });

    this.filteredBusinesses = filtered;
    this.paginateBusinesses();
  }

  paginateBusinesses(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBusinesses = this.filteredBusinesses.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateBusinesses();
  }

  goToBusiness(id: number): void {
    this.router.navigate(['/business', id]);
  }
}
