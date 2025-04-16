import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import * as AOS from 'aos';

@Component({
  selector: 'app-pathways',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pathways.component.html',
  styleUrl: './pathways.component.scss'
})
export class PathwaysComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;
  @Output() clicked = new EventEmitter<Event>();

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
