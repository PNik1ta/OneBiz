import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QuestionComponent } from './question/question.component';
import { IQuestion } from '../../../core/interfaces/question.interface';
import * as AOS from 'aos';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, QuestionComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
  currentId: number = -1;
  initialized: boolean = false;

  defaultQuestions: IQuestion[] = [
    {
      title: 'Как клиенты могут записаться ко мне?',
      answer: 'Вы создаёте свою страницу на OneBiz, указываете услуги и расписание. Клиенты бронируют свободное время прямо с телефона.'
    },
    {
      title: 'Можно ли посмотреть аналитику по бронированиям?',
      answer: 'Да, в личном кабинете вы увидите графики посещаемости, прибыли и загрузки по дням.'
    },
    {
      title: 'Нужно ли устанавливать приложение?',
      answer: 'Нет, OneBiz работает в браузере на телефоне и компьютере. Вам не нужно ничего скачивать.'
    },
    {
      title: 'Могу ли я продвигать свои услуги через платформу?',
      answer: 'Конечно. У нас есть встроенный блог, где вы можете рассказывать о новостях, скидках и новых услугах. Это увидят все ваши клиенты.'
    },
    {
      title: 'Сколько это стоит?',
      answer: 'Базовый тариф — бесплатный. Платные функции подключаются по мере необходимости: аналитика, расширенные настройки и продвижение.'
    }
  ];


  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initialized = true;
    }

    AOS.init({
      duration: 800,
      once: false,
    });
  }

  handleOpen(index: number): void {
    this.currentId = this.currentId === index ? -1 : index;
  }
}
