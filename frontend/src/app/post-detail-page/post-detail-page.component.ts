import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_IMG_URL } from '../core/constants/api-url';
import { IPost } from '../core/interfaces/post.interface';
import { LikeService } from '../core/services/like.service';
import { PostService } from '../core/services/post.service';
import { IComment } from '../core/interfaces/comment.interface';
import { CommentService } from '../core/services/comment.service';
import { UsersService } from '../core/services/users.service';
import { IUser } from '../core/interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import * as AOS from 'aos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post-detail-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './post-detail-page.component.html',
  styleUrls: ['./post-detail-page.component.scss']
})
export class PostDetailPageComponent implements OnInit {
  post!: IPost;
  comments: IComment[] = [];
  newComment: string = '';
  newCommentTitle: string = '';
  isLiked = false;
  likeId: number | null = null;
  user: IUser | null = null;
  API_IMG_URL = API_IMG_URL;
  editCommentId: number | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private likeService: LikeService,
    private commentService: CommentService,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      Promise.all([
        this.postService.getPostById(postId).toPromise(),
        this.likeService.getLikeByUserId().toPromise(),
        this.userService.getProfile().toPromise(),
        this.commentService.getCommentByPostId(postId).toPromise()
      ]).then(([postsRes, likesRes, usersRes, commentsRes]) => {
        this.postService.getPostById(postId).subscribe(res => {
          this.post = postsRes?.data!;
        });

        this.likeService.getLikeByUserId().subscribe(res => {
          const userLikes = likesRes?.data ?? [];
          const like = userLikes.find(l => l.post_id === postId);
          if (like) {
            this.isLiked = true;
            this.likeId = like.id!;
          }
        });

        this.userService.getProfile().subscribe((res) => {
          this.user = usersRes?.data ?? null;
        });

        this.commentService.getCommentByPostId(postId).subscribe(res => {
          this.comments = commentsRes?.data ?? [];
        });
      }).finally(() => {
        this.isLoading = false;
      })
    }

    AOS.init({
      duration: 800,
      once: false,
    });
  }

  toggleLike(): void {
    if (!this.post) return;

    if (this.isLiked && this.likeId) {
      this.likeService.deleteLike(this.likeId).subscribe(() => {
        this.isLiked = false;
        this.likeId = null;
        this.post.likes--;
      });
    } else {
      this.likeService.createLike({ post_id: this.post.id! }).subscribe(res => {
        this.isLiked = true;
        this.likeId = res.data?.id ?? null;
        this.post.likes++;
      });
    }
  }

  sendComment(): void {
    if (!this.newComment.trim() || !this.newCommentTitle.trim()) return;

    if (this.editCommentId) {
      this.commentService.updateComment(
        { title: this.newCommentTitle, text: this.newComment },
        this.editCommentId
      ).subscribe(() => {
        const comment = this.comments.find(c => c.id === this.editCommentId);
        if (comment) {
          comment.title = this.newCommentTitle;
          comment.text = this.newComment;
          comment.is_edited = true;
        }
        this.editCommentId = null;
        this.newComment = '';
        this.newCommentTitle = '';
      });
      return;
    }

    this.commentService.createComment({
      post_id: this.post.id!,
      title: this.newCommentTitle,
      text: this.newComment
    }).subscribe(res => {
      this.comments.unshift(res.data!);
      this.newComment = '';
      this.newCommentTitle = '';
    });
  }

  startEdit(comment: IComment): void {
    this.newComment = comment.text;
    this.newCommentTitle = comment.title;
    this.editCommentId = comment.id!;
  }

}
