import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { EReviewType } from '../../shared/enums/review-types.enum';
import { IReview } from '../../shared/interfaces/review.interface';

export class Review implements IReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  booking_business_id: number;

  @Column({
    type: 'enum',
    enum: EReviewType,
    default: EReviewType.BUSINESS,
  })
  type: EReviewType;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  rating: number;

  @Column()
  description: string;

  @Column({ default: new Date() })
  created_at: Date;
}
