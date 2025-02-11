import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ILike } from '../../shared/interfaces/like.interface';

@Entity()
export class Like implements ILike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;
}
