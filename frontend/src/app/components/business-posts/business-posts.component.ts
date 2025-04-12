import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IBusiness } from '../../core/interfaces/business.interface';
import { switchMap } from 'rxjs';
import { ILike } from '../../core/interfaces/like.interface';
import { IPost } from '../../core/interfaces/post.interface';
import { ITag } from '../../core/interfaces/tag.interface';
import { BusinessService } from '../../core/services/business.service';
import { LikeService } from '../../core/services/like.service';
import { PostService } from '../../core/services/post.service';
import { TagService } from '../../core/services/tag.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-business-posts',
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
  templateUrl: './business-posts.component.html',
  styleUrl: './business-posts.component.scss'
})
export class BusinessPostsComponent {
  @Input() user: IUser | null = null;
  @Input() business: IBusiness | null = null;

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
    this.businessService.getUserBusiness().subscribe((res) => {
      this.business = res.data ?? null;

      if (this.business) {
        this.postService.getPostByBusinessId(this.business.id!).subscribe((res) => {
          this.allPosts = res.data ?? [];
          this.filteredPosts = [...this.allPosts];
        })
      }
    })


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
