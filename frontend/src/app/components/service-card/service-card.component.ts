import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IService } from '../../core/interfaces/service.interface';
import { API_IMG_URL } from '../../core/constants/api-url';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent {
  @Input() service!: IService;
  API_IMG_URL = API_IMG_URL;
}
