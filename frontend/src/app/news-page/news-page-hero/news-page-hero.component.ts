import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'

@Component({
  selector: 'app-news-hero',
  imports: [CommonModule],
  templateUrl: './news-page-hero.component.html',
  styleUrl: './news-page-hero.component.scss'
})
export class NewsPageHeroComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }

}
