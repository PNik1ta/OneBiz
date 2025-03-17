import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { CommentService } from '../../../core/services/comment.service';
import { IUpdateCommentDto } from '../../../core/dto/comment/update-comment.dto';
import { ICreateCommentDto } from '../../../core/dto/comment/create-comment.dto';

@Component({
  standalone: true,
  selector: 'app-business-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class CommentDialogComponent {
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.commentForm = this.fb.group({
      post_id: [data.comment?.post_id || 0, Validators.required],
      title: [data.comment?.title || '', [Validators.required]],
      text: [data.comment?.text || '', [Validators.required]],
    });
  }

  // Метод сохранения пользователя
  saveComment(): void {
    if (this.commentForm.invalid) return;

    const commentData = this.commentForm.value;

    this.saveOrUpdateComment(commentData)
  }

  private saveOrUpdateComment(commentData: any): void {
    if (this.data.comment) {
      const dto: IUpdateCommentDto = {
        title: commentData.title,
        text: commentData.text
      }
      this.commentService.updateComment(dto, this.data.comment.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateCommentDto = {
        post_id: commentData.post_id,
        title: commentData.title,
        text: commentData.text,
      }
      this.commentService.createComment(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
