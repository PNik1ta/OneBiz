import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ICommunityItem } from '../../../../core/interfaces/community-item.interface';

@Component({
  selector: 'app-community-item',
  imports: [CommonModule],
  templateUrl: './community-item.component.html',
  styleUrl: './community-item.component.scss'
})
export class CommunityItemComponent {
  isDesktop = window.innerWidth >= 768;

  @Input('item') item: ICommunityItem = {
    img: '',
    content: '',
    fullname: '',
    job: '',
    link: '',
  }
}
