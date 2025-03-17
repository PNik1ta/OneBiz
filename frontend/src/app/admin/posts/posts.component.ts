import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { IPost } from '../../core/interfaces/post.interface';
import { PostService } from '../../core/services/post.service';
import { PostDialogComponent } from './post-dialog/post-dialog.component';

@Component({
  standalone: true,
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class PostComponent implements OnInit {
  displayedColumns: string[] = ['id', 'business_id', 'title', 'text', 'created_at', 'likes', 'tagId', 'actions'];
  dataSource = new MatTableDataSource<IPost>([]);

  constructor(private postService: PostService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.dataSource.data = posts.data ?? [];
    });
  }

  addPost(): void {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '400px',
      data: { post: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPosts();
    });
  }

  editPost(post: IPost): void {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '400px',
      data: { post },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPosts();
    });
  }

  deletePost(id: number): void {
    if (confirm('Удалить пост?')) {
      this.postService.deletePost(id).subscribe(() => this.loadPosts());
    }
  }
}
