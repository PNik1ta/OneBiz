import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  isDesktop = window.innerWidth >= 768;

  items = [
    { title: 'упрошай работу с', description: 'клиентами' },
    { title: this.isDesktop ? 'строй сильный' : 'строй', description: 'бренд' },
    { title: this.isDesktop ? 'прозрачная аналитика по' : 'аналитика по', description: 'прибыли' },
  ]
}
