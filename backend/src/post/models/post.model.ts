import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IPost } from '../../shared/interfaces/post.interface';

@Entity()
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  business_id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  background_url: string;

  @Column()
  created_at: Date;

  @Column()
  likes: number;

  @Column('int', { array: true, default: [] })
  tagsId: number[];
}
