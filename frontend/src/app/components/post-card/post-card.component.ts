import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../core/interfaces/post.interface';
import { ITag } from '../../core/interfaces/tag.interface';
import { IBusiness } from '../../core/interfaces/business.interface';
import { API_IMG_URL } from '../../core/constants/api-url';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() post!: IPost;
  @Input() tags: ITag[] = [];
  @Input() businesses: IBusiness[] = [];

  API_IMG_URL = API_IMG_URL;

  get postTags(): ITag[] {
    return this.tags.filter(tag => this.post.tagsId.includes(tag.id!));
  }

  get postBusiness(): IBusiness | undefined {
    return this.businesses.find(b => b.id === this.post.business_id);
  }
}
