import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-service-hero',
  imports: [CommonModule],
  templateUrl: './service-page-hero.component.html',
  styleUrl: './service-page-hero.component.scss'
})
export class ServicePageHeroComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
