import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IBusiness } from '../../shared/interfaces/business.interface';

@Entity()
export class Business implements IBusiness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column()
  company_description: string;

  @Column('text', { array: true, default: [] })
  preview_images_url: string[];

  @Column()
  user_id: number;

  @Column({ nullable: true })
  city_id: number;

  @Column({ nullable: true })
  place: string;

  avg_rating?: number;
  review_count?: number;
}
