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
  searchTerm: string = '';


  constructor(
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.businessService.getBusinesses().subscribe(res => {
      this.allBusinesses = res.data ?? [];
      this.filteredBusinesses = res.data ?? [];
    });

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
    if (!this.selectedServiceId) {
      this.filteredBusinesses = this.allBusinesses;
      return;
    }

    this.filteredBusinesses = this.allBusinesses.filter(business =>
      this.allServices.some(
        service => service.business_id === business.id && service.id === this.selectedServiceId
      )
    );
  }

  goToBusiness(id: number): void {
    this.router.navigate(['/business', id]);
  }
}
