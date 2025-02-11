import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITag } from '../../shared/interfaces/tag.interface';

@Entity()
export class Tag implements ITag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
