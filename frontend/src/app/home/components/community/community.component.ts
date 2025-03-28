import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommunityItemComponent } from './community-item/community-item.component';
import { ICommunityItem } from '../../../core/interfaces/community-item.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-community',
  imports: [CommonModule, CommunityItemComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 вот это
})
export class CommunityComponent {
  isDesktop = window.innerWidth >= 768;


  data: ICommunityItem[] = [
    {
      content: 'OneBiz помог мне наладить поток клиентов — всё просто и удобно.',
      img: '/community/user.png',
      fullname: 'Екатерина Морозова',
      job: 'Владелица студии маникюра',
      link: 'https://google.com',
    },
    {
      content: 'Теперь я вижу статистику бронирований и дохода без Excel. Спасибо!',
      img: '/community/user.png',
      fullname: 'Александр Петров',
      job: 'Парикмахер',
      link: 'https://google.com',
    },
    {
      content: 'Раньше записывали клиентов в блокнот, а теперь всё автоматизировано.',
      img: '/community/user.png',
      fullname: 'ИП Иванова',
      job: 'Косметолог',
      link: 'https://google.com',
    },
    {
      content: 'Простой интерфейс и возможность вести блог — клиенты стали чаще приходить.',
      img: '/community/user.png',
      fullname: 'Мария Литвиненко',
      job: 'Массажист',
      link: 'https://google.com',
    },
    {
      content: 'Я могу отслеживать, сколько клиентов приходит и какие дни самые загруженные.',
      img: '/community/user.png',
      fullname: 'Дмитрий Савченко',
      job: 'Барбер',
      link: 'https://google.com',
    },
    {
      content: 'Очень крутой сервис — даже мои клиенты отмечают, как удобно записываться!',
      img: '/community/user.png',
      fullname: 'Ольга Корнилова',
      job: 'Стилист',
      link: 'https://google.com',
    },
  ];


}
