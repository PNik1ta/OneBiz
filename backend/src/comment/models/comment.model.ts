import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IComment } from '../../shared/interfaces/comment.interface';

export class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  post_id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  created_at: Date;

  @Column()
  is_edited: boolean;
}
