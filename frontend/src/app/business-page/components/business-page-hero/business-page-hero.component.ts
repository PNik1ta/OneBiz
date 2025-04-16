import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-business-hero',
  imports: [CommonModule],
  templateUrl: './business-page-hero.component.html',
  styleUrl: './business-page-hero.component.scss'
})
export class BusinessPageHeroComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
