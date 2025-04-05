import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-business-hero',
  imports: [CommonModule],
  templateUrl: './business-page-hero.component.html',
  styleUrl: './business-page-hero.component.scss'
})
export class BusinessPageHeroComponent {
  isDesktop = window.innerWidth >= 768;

}
