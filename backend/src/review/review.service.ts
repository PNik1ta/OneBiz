import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { BaseResponse } from '../shared/classes/base-response';
import { Review } from './models/review.model';
import { ReviewEntity } from './entities/review.entity';
import {
  REVIEW_CREATE_ERROR,
  REVIEW_FIND_ERROR,
  REVIEW_PERMISSIONS_DELETE_ERROR,
  REVIEW_PERMISSIONS_UPDATE_ERROR,
  REVIEW_UPDATE_ERROR,
} from '../shared/errors/review.errors';
import {
  REVIEW_CREATE,
  REVIEW_DELETED,
  REVIEW_FIND,
  REVIEW_FIND_ALL,
  REVIEW_UPDATED,
} from '../shared/messages/review.messages';
import { UpdateReviewDto } from './dto/update-review.dto';
import { EReviewType } from '../shared/enums/review-types.enum';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(
    dto: CreateReviewDto,
    userId: number,
  ): Promise<BaseResponse<Review>> {
    const review = new ReviewEntity({
      booking_business_id: dto.booking_business_id,
      type: dto.type,
      title: dto.title,
      rating: dto.rating,
      user_id: userId,
      description: dto.description,
      created_at: new Date(),
    });

    const createdReview = await this.reviewRepository.create(review);

    if (!createdReview) {
      throw new Error(REVIEW_CREATE_ERROR);
    }

    return new BaseResponse<Review>(REVIEW_CREATE, createdReview);
  }

  async findAll(): Promise<BaseResponse<Review[]>> {
    const reviews = await this.reviewRepository.findAll();

    if (!reviews) {
      throw new Error(REVIEW_FIND_ERROR);
    }

    return new BaseResponse<Review[]>(REVIEW_FIND_ALL, reviews);
  }

  async findByBookingBusinessId(
    bookingBusinessId: number,
    type: EReviewType,
  ): Promise<BaseResponse<Review[]>> {
    const reviews = await this.reviewRepository.findByBookingBusinessId(
      bookingBusinessId,
      type,
    );

    if (!reviews) {
      throw new Error(REVIEW_FIND_ERROR);
    }

    return new BaseResponse<Review[]>(REVIEW_FIND_ALL, reviews);
  }

  async findById(id: number): Promise<BaseResponse<Review>> {
    const review = await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error(REVIEW_FIND_ERROR);
    }

    return new BaseResponse<Review>(REVIEW_FIND, review);
  }

  async findByUserId(userId: number): Promise<BaseResponse<Review[]>> {
    const review = await this.reviewRepository.findByUserId(userId);

    if (!review) {
      throw new Error(REVIEW_FIND_ERROR);
    }

    return new BaseResponse<Review[]>(REVIEW_FIND, review);
  }

  async delete(id: number, userId: number): Promise<BaseResponse<void>> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new Error(REVIEW_FIND_ERROR);
    }

    if (review.user_id !== userId) {
      throw new Error(REVIEW_PERMISSIONS_DELETE_ERROR);
    }
    await this.reviewRepository.delete(id);
    return new BaseResponse<void>(REVIEW_DELETED);
  }

  async update(
    id: number,
    dto: UpdateReviewDto,
    userId: number,
  ): Promise<BaseResponse<void>> {
    const review = await this.reviewRepository.findById(id);

    if (!review) {
      throw new Error(REVIEW_FIND_ERROR);
    }

    if (review.user_id !== userId) {
      throw new Error(REVIEW_PERMISSIONS_UPDATE_ERROR);
    }

    const entity = new ReviewEntity({
      booking_business_id: review.booking_business_id,
      type: review.type,
      title: dto.title,
      description: dto.description,
      user_id: review.user_id,
      rating: dto.rating,
      created_at: review.created_at,
    });

    const updatedReview = await this.reviewRepository.update(id, entity);

    if (!updatedReview) {
      throw new Error(REVIEW_UPDATE_ERROR);
    }

    return new BaseResponse<void>(REVIEW_UPDATED);
  }
}
