import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { IPost } from '../../core/interfaces/post.interface';
import { IReview } from '../../core/interfaces/review.interface';
import { ReviewService } from '../../core/services/review.service';
import { ReviewDialogComponent } from './reviews-dialog/reviews-dialog.component';

@Component({
  standalone: true,
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class ReviewComponent implements OnInit {
  displayedColumns: string[] = ['id', 'booking_business_id', 'type', 'user_id', 'title', 'rating', 'description', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<IReview>([]);

  constructor(private reviewService: ReviewService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviews().subscribe(reviews => {
      this.dataSource.data = reviews.data ?? [];
    });
  }

  addReview(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: { review: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadReviews();
    });
  }

  editReview(post: IPost): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: { post },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadReviews();
    });
  }

  deleteReview(id: number): void {
    if (confirm('Удалить отзыв?')) {
      this.reviewService.deleteReview(id).subscribe(() => this.loadReviews());
    }
  }
}
