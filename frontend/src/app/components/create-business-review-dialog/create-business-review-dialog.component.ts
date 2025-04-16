import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICreateReviewDto } from '../../core/dto/review/create-review.dto';
import { EReviewType } from '../../core/enums/review-types.enum';
import { ReviewService } from '../../core/services/review.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-booking-review-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-business-review-dialog.component.html',
  styleUrl: './create-business-review-dialog.component.scss'
})
export class CreateBusinessReviewDialogComponent {
  form: FormGroup;
  rating = 0;
  hoverRating = 0;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    public dialogRef: MatDialogRef<CreateBusinessReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public businessId: number
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  submit(): void {
    if (this.form.invalid || !this.rating) return;

    const dto: ICreateReviewDto = {
      booking_business_id: this.businessId,
      type: EReviewType.BUSINESS,
      title: this.form.value.title,
      description: this.form.value.description,
      rating: this.rating,
    };

    this.reviewService.createReview(dto).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
