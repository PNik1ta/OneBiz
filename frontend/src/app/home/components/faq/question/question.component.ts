import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question',
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  isDesktop = window.innerWidth >= 768;

  @Input() currentId: number = 0
  @Input() questionId: number = 0
  @Output() handleOpen = new EventEmitter<void>();
  @Input() question: { title: string, answer: string } = { title: '', answer: '' }

  onClick(): void {
    this.handleOpen.emit();
  }
}
