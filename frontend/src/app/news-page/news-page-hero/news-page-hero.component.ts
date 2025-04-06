import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-news-hero',
  imports: [CommonModule],
  templateUrl: './news-page-hero.component.html',
  styleUrl: './news-page-hero.component.scss'
})
export class NewsPageHeroComponent {
  isDesktop = window.innerWidth >= 768;

}
