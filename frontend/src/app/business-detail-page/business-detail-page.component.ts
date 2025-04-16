import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IBusiness } from '../core/interfaces/business.interface';
import { IService } from '../core/interfaces/service.interface';
import { BusinessService } from '../core/services/business.service';
import { ServiceService } from '../core/services/service.service';
import { API_IMG_URL } from '../core/constants/api-url';
import { ServiceCardComponent } from '../components/service-card/service-card.component';
import { ButtonComponent } from "../components/button/button.component";
import { CreateBusinessReviewDialogComponent } from '../components/create-business-review-dialog/create-business-review-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReviewService } from '../core/services/review.service';
import { IReview } from '../core/interfaces/review.interface';
import { EReviewType } from '../core/enums/review-types.enum';

@Component({
  selector: 'app-business-detail-page',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, ButtonComponent],
  templateUrl: './business-detail-page.component.html',
  styleUrl: './business-detail-page.component.scss'
})
export class BusinessDetailPageComponent implements OnInit {
  businessId: number = 0;
  business: IBusiness | null = null;
  services: IService[] = [];
  reviews: IReview[] = [];
  API_IMG_URL = API_IMG_URL

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private reviewService: ReviewService,
  ) { }

  ngOnInit(): void {
    this.businessId = +this.route.snapshot.paramMap.get('id')!;

    this.businessService.getBusinessById(this.businessId).subscribe(res => {
      this.business = res.data ?? null;
    });

    this.serviceService.getServiceByBusinessId(this.businessId).subscribe(res => {
      this.services = res.data ?? [];
    });

    this.getUserReviews();
  }

  openReviewDialog(businessId: number) {
    const dialogRef = this.dialog.open(CreateBusinessReviewDialogComponent, {
      width: '500px',
      data: businessId
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUserReviews();
      }
    });

  }

  getUserReviews(): void {
    this.reviewService.getByUserId().subscribe(res => {
      this.reviews = res.data ?? [];
    });
  }

  hasReview(businessId: number): boolean {
    return this.reviews.some(review => review.booking_business_id === businessId && review.type === EReviewType.BUSINESS);
  }
}
