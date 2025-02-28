import { EReviewType } from "../../enums/review-types.enum";

export interface ICreateReviewDto {
  booking_business_id: number;
  type: EReviewType;
  title: string;
  rating: number;
  description: string;
}
