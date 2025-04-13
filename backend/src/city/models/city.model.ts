import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICity } from '../../shared/interfaces/city.interface';

@Entity()
export class City implements ICity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
