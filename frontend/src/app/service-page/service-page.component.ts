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
    ServiceCardComponent
  ],
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.scss',
})
export class ServicePageComponent implements OnInit {
  allServices: IService[] = [];
  filteredServices: IService[] = [];
  allBusinesses: IBusiness[] = [];
  selectedBusinessId: number | null = null;
  searchQuery: string = '';

  constructor(
    private serviceService: ServiceService,
    private businessService: BusinessService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe(res => {
      this.allServices = res.data ?? [];
      this.filteredServices = [...this.allServices];
    });

    this.businessService.getBusinesses().subscribe(res => {
      this.allBusinesses = res.data ?? [];
    });
  }

  filterServices(): void {
    this.filteredServices = this.allServices.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesBusiness = this.selectedBusinessId
        ? service.business_id === this.selectedBusinessId
        : true;
      return matchesSearch && matchesBusiness;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedBusinessId = null;
    this.filteredServices = [...this.allServices];
  }

  goToService(id: number): void {
    this.router.navigate(['/service', id]);
  }
}
