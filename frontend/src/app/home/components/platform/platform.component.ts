import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-platform',
  imports: [CommonModule],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.scss'
})
export class PlatformComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
