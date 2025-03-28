import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-pathways',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pathways.component.html',
  styleUrl: './pathways.component.scss'
})
export class PathwaysComponent {
  isDesktop = window.innerWidth >= 768;
}
