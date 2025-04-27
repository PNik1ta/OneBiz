import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../core/services/business.service';
import { ServiceService } from '../core/services/service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ServicePageHeroComponent } from './components/service-page-hero/service-page-hero.component';
import { IService } from '../core/interfaces/service.interface';
import { IBusiness } from '../core/interfaces/business.interface';
import { ServiceCardComponent } from '../components/service-card/service-card.component';
import { CityService } from '../core/services/city.service';
import { ICity } from '../core/interfaces/city.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import * as AOS from 'aos';

@Component({
  selector: 'app-service-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ServicePageHeroComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ServiceCardComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.scss',
})
export class ServicePageComponent implements OnInit {
  allServices: IService[] = [];
  filteredServices: IService[] = [];
  allBusinesses: IBusiness[] = [];
  allCities: ICity[] = [];
  selectedBusinessId: number | null = null;
  selectedCityId: number | null = null;
  searchQuery: string = '';
  isLoading: boolean = true;
  pageSize = 20;
  currentPage = 0;
  paginatedServices: IService[] = [];


  constructor(
    private serviceService: ServiceService,
    private businessService: BusinessService,
    private cityService: CityService,
    public router: Router
  ) { }

  ngOnInit(): void {
    Promise.all([
      this.serviceService.getServices().toPromise(),
      this.cityService.getCities().toPromise(),
      this.businessService.getBusinesses().toPromise()
    ]).then(([servicesRes, citiesRes, businessesRes]) => {
      this.allServices = servicesRes?.data ?? [];
      this.filteredServices = [...this.allServices];

      this.allCities = citiesRes?.data ?? [];
      this.allBusinesses = businessesRes?.data ?? [];
      this.paginateServices()
    }).finally(() => {
      this.isLoading = false;
    });

    AOS.init({
      duration: 800,
      once: false,
    });
  }

  filterServices(): void {
    this.filteredServices = this.allServices.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesBusiness = this.selectedBusinessId
        ? service.business_id === this.selectedBusinessId
        : true;

      const business = this.allBusinesses.find(b => b.id === service.business_id);
      const matchesCity = this.selectedCityId
        ? business?.city_id === this.selectedCityId
        : true;

      return matchesSearch && matchesBusiness && matchesCity;
    });
    this.paginateServices()
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedBusinessId = null;
    this.filteredServices = [...this.allServices];
  }

  paginateServices(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.filteredServices.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateServices();
  }

  goToService(id: number): void {
    this.router.navigate(['/service', id]);
  }
}
