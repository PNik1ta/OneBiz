import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';

import * as AOS from 'aos';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;
  @Output() clicked = new EventEmitter<Event>();

  items = [
    { title: 'упрошай работу с', description: 'клиентами' },
    { title: this.isDesktop ? 'строй сильный' : 'строй', description: 'бренд' },
    { title: this.isDesktop ? 'прозрачная аналитика по' : 'аналитика по', description: 'прибыли' },
  ]

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
