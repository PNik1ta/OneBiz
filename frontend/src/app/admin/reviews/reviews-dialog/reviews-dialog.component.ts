import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { ReviewService } from '../../../core/services/review.service';
import { ICreateReviewDto } from '../../../core/dto/review/create-review.dto';
import { IUpdateReviewDto } from '../../../core/dto/review/update-review.dto';

@Component({
  standalone: true,
  selector: 'app-review-dialog',
  templateUrl: './reviews-dialog.component.html',
  styleUrls: ['./reviews-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class ReviewDialogComponent {
  reviewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewForm = this.fb.group({
      booking_business_id: [data.review?.booking_business_id || '', Validators.required],
      type: [data.review?.type || '', [Validators.required]],
      title: [data.review?.title || '', Validators.required],
      rating: [data.review?.rating || '', Validators.required],
      description: [data.review?.description || '', Validators.required]
    });
  }

  // Метод сохранения пользователя
  saveReview(): void {
    if (this.reviewForm.invalid) return;

    const reviewData = this.reviewForm.value;

    this.saveOrUpdateReview(reviewData);

  }

  private saveOrUpdateReview(reviewData: any): void {
    if (this.data.review) {
      const dto: IUpdateReviewDto = {
        title: reviewData.title,
        rating: reviewData.rating,
        description: reviewData.description,
      }
      this.reviewService.updateReview(dto, this.data.review.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateReviewDto = {
        booking_business_id: reviewData.booking_business_id,
        type: reviewData.type,
        title: reviewData.title,
        rating: reviewData.rating,
        description: reviewData.description,
      }
      this.reviewService.createReview(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
