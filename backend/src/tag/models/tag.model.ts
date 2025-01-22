import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ITag } from '../../shared/interfaces/tag.interface';

export class Tag implements ITag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
