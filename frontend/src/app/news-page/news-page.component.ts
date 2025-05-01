import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewsPageHeroComponent } from './news-page-hero/news-page-hero.component';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { PostService } from '../core/services/post.service';
import { TagService } from '../core/services/tag.service';
import { BusinessService } from '../core/services/business.service';
import { IPost } from '../core/interfaces/post.interface';
import { ITag } from '../core/interfaces/tag.interface';
import { IBusiness } from '../core/interfaces/business.interface';
import * as AOS from 'aos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    NewsPageHeroComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    PostCardComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.scss',
})
export class NewsPageComponent implements OnInit {
  allPosts: IPost[] = [];
  filteredPosts: IPost[] = [];
  allTags: ITag[] = [];
  allBusinesses: IBusiness[] = [];

  selectedTagId: number | null = null;
  selectedBusinessId: number | null = null;
  searchTerm: string = '';

  isLoading: boolean = true;
  pageSize = 20;
  currentPage = 0;
  paginatedPosts: IPost[] = [];

  constructor(
    private postService: PostService,
    private tagService: TagService,
    private businessService: BusinessService
  ) { }

  ngOnInit(): void {
    Promise.all([
      this.postService.getPosts().toPromise(),
      this.tagService.getTags().toPromise(),
      this.businessService.getBusinesses().toPromise()
    ]).then(([postsRes, tagsRes, businessesRes]) => {
      this.allPosts = postsRes?.data ?? [];
      this.filteredPosts = [...this.allPosts];

      this.allTags = tagsRes?.data ?? [];

      this.allBusinesses = businessesRes?.data ?? [];

      this.paginatePosts();
    }).finally(() => {
      this.isLoading = false;
    })

    AOS.init({
      duration: 800,
      once: false,
    });
  }

  paginatePosts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginatePosts();
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
    this.paginatePosts();
  }
}
