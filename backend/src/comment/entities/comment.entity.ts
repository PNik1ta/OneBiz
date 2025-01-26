import { IComment } from '../../shared/interfaces/comment.interface';

export class CommentEntity implements IComment {
  id?: number;
  user_id: number;
  post_id: number;
  title: string;
  text: string;
  created_at: Date;
  is_edited: boolean;

  constructor(comment: IComment) {
    this.id = comment.id;
    this.user_id = comment.user_id;
    this.post_id = comment.post_id;
    this.title = comment.title;
    this.text = comment.text;
    this.created_at = comment.created_at;
    this.is_edited = comment.is_edited;
  }
}
