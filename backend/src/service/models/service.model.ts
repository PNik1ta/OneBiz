import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IService } from '../../shared/interfaces/service.interface';

export class Service implements IService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  background_url?: string;

  @Column()
  amount: number;

  @Column()
  business_id: number;

  @Column({ nullable: true })
  discount?: number;
}
