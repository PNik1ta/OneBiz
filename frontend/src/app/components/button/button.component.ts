import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnInit {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() color: 'primary' | 'accent' | 'warn' | string = 'primary';

  @Output() clicked = new EventEmitter<Event>();

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
