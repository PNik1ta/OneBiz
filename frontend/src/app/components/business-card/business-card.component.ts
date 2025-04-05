import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IBusiness } from '../../core/interfaces/business.interface';
import { API_IMG_URL } from '../../core/constants/api-url';

@Component({
  selector: 'app-business-card',
  imports: [CommonModule],
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
})
export class BusinessCardComponent {
  @Input() business!: IBusiness;
  API_IMG_URL = API_IMG_URL;

  constructor(private router: Router) {}

  goToBusiness() {
    this.router.navigate(['/business', this.business.id]);
  }
}
