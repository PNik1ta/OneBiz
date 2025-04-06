import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-service-hero',
  imports: [CommonModule],
  templateUrl: './service-page-hero.component.html',
  styleUrl: './service-page-hero.component.scss'
})
export class ServicePageHeroComponent {
  isDesktop = window.innerWidth >= 768;

}
