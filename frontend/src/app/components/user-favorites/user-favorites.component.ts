import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { IBusiness } from '../../core/interfaces/business.interface';
import { IPost } from '../../core/interfaces/post.interface';
import { ITag } from '../../core/interfaces/tag.interface';
import { BusinessService } from '../../core/services/business.service';
import { PostService } from '../../core/services/post.service';
import { TagService } from '../../core/services/tag.service';
import { CommonModule } from '@angular/common';
import { LikeService } from '../../core/services/like.service';
import { ILike } from '../../core/interfaces/like.interface';
import { PostCardComponent } from '../post-card/post-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-favorites',
  imports: [
    CommonModule,
    PostCardComponent,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.scss'
})
export class UserFavoritesComponent {
  @Input() user: IUser | null = null;

  allPosts: IPost[] = [];
  allLikes: ILike[] = [];
  filteredPosts: IPost[] = [];
  allTags: ITag[] = [];
  allBusinesses: IBusiness[] = [];

  selectedTagId: number | null = null;
  selectedBusinessId: number | null = null;
  searchTerm: string = '';

  constructor(
    private likeService: LikeService,
    private postService: PostService,
    private tagService: TagService,
    private businessService: BusinessService
  ) { }

  ngOnInit(): void {
    this.likeService.getLikeByUserId().pipe(
      switchMap((res) => {
        this.allLikes = res.data ?? [];
        return this.postService.getPosts();
      })
    ).subscribe(res => {
      this.allPosts = res.data ?? [];
      this.allPosts = this.allPosts.filter(post =>
        this.allLikes.some(like => like.post_id === post.id)
      );
      this.filteredPosts = [...this.allPosts];
    });


    this.tagService.getTags().subscribe(res => {
      this.allTags = res.data ?? [];
    });

    this.businessService.getBusinesses().subscribe(res => {
      this.allBusinesses = res.data ?? [];
    });
  }

  filterPosts(): void {
    this.filteredPosts = this.allPosts.filter(post => {
      const matchesTag = this.selectedTagId ? post.tagsId.includes(this.selectedTagId) : true;
      const matchesBusiness = this.selectedBusinessId ? post.business_id === this.selectedBusinessId : true;
      const matchesSearch = this.searchTerm.trim()
        ? post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      return matchesTag && matchesBusiness && matchesSearch;
    });
  }
}
