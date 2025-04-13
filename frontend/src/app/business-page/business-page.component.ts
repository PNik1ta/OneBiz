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
    MatInputModule
  ],
  templateUrl: './business-page.component.html',
  styleUrl: './business-page.component.scss',
})
export class BusinessPageComponent implements OnInit {
  allBusinesses: IBusiness[] = [];
  filteredBusinesses: IBusiness[] = [];
  allServices: IService[] = [];
  selectedServiceId: number | null = null;
  selectedCityId: number | null = null;
  searchTerm: string = '';
  allCities: ICity[] = [];

  constructor(
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private cityService: CityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.businessService.getBusinesses().subscribe(res => {
      this.allBusinesses = res.data ?? [];
      this.filteredBusinesses = res.data ?? [];
    });

    this.cityService.getCities().subscribe(res => {
      this.allCities = res.data ?? [];
    })

    this.serviceService.getServices().subscribe(res => {
      this.allServices = res.data ?? [];
    });
  }

  clearFilter(): void {

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
  }


  filterBusinesses(): void {
    this.filteredBusinesses = this.allBusinesses.filter(business => {
      const matchesService = !this.selectedServiceId || this.allServices.some(
        service => service.business_id === business.id && service.id === this.selectedServiceId
      );

      const matchesCity = !this.selectedCityId || business.city_id === this.selectedCityId;

      return matchesService && matchesCity;
    });
  }


  goToBusiness(id: number): void {
    this.router.navigate(['/business', id]);
  }
}
