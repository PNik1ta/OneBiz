import { EReviewType } from '../../shared/enums/review-types.enum';
import { IReview } from '../../shared/interfaces/review.interface';

export class ReviewEntity implements IReview {
  id?: number;
  booking_business_id: number;
  type: EReviewType;
  user_id: number;
  title: string;
  rating: number;
  description: string;
  created_at: Date;

  constructor(review: IReview) {
    this.id = review.id;
    this.booking_business_id = review.booking_business_id;
    this.type = review.type;
    this.user_id = review.user_id;
    this.title = review.title;
    this.rating = review.rating;
    this.description = review.description;
    this.created_at = review.created_at;
  }
}
