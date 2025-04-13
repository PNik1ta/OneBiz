import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private router: Router) {}

  adminLinks = [
    { title: 'Пользователи', icon: 'people', link: '/admin/users' },
    { title: 'Бизнесы', icon: 'business', link: '/admin/businesses' },
    { title: 'Бронирования', icon: 'event', link: '/admin/bookings' },
    { title: 'Услуги', icon: 'build', link: '/admin/services' },
    { title: 'Отзывы', icon: 'rate_review', link: '/admin/reviews' },
    { title: 'Посты', icon: 'article', link: '/admin/posts' },
    { title: 'Комментарии', icon: 'comment', link: '/admin/comments' },
    { title: 'Лайки', icon: 'thumb_up', link: '/admin/likes' },
    { title: 'Теги', icon: 'label', link: '/admin/tags' },
    { title: 'Города', icon: 'location_city', link: '/admin/cities' },
  ];

  navigate(link: string) {
    this.router.navigate([link]);
  }
}
