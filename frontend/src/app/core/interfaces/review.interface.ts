import { EReviewType } from '../enums/review-types.enum';

export interface IReview {
  id?: number;
  booking_business_id: number;
  type: EReviewType;
  user_id: number;
  title: string;
  rating: number;
  description: string;
  created_at: Date;
}
