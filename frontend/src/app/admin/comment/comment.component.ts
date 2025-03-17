import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { IComment } from '../../core/interfaces/comment.interface';
import { CommentService } from '../../core/services/comment.service';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';

@Component({
  standalone: true,
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class CommentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'user_id', 'post_id', 'title', 'text', 'created_at', 'is_edited', 'actions'];
  dataSource = new MatTableDataSource<IComment>([]);

  constructor(private commentService: CommentService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments().subscribe(comments => {
      this.dataSource.data = comments.data ?? [];
    });
  }

  addComment(): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: { comment: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadComments();
    });
  }

  editComment(comment: IComment): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: { comment },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadComments();
    });
  }

  deleteComment(id: number): void {
    if (confirm('Удалить комментарий?')) {
      this.commentService.deleteComment(id).subscribe(() => this.loadComments());
    }
  }
}
