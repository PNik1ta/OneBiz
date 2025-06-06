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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as AOS from 'aos';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoDialogComponent } from '../components/user-info-dialog/user-info-dialog.component';
import { AuthService } from '../core/services/auth.service';
import { IUser } from '../core/interfaces/user.interface';
import { UsersService } from '../core/services/users.service';

@Component({
  selector: 'app-business-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ServiceCardComponent,
    ButtonComponent,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './business-detail-page.component.html',
  styleUrl: './business-detail-page.component.scss'
})
export class BusinessDetailPageComponent implements OnInit {
  businessId: number = 0;
  business: IBusiness | null = null;
  services: IService[] = [];
  reviews: IReview[] = [];
  user: IUser | null = null;
  API_IMG_URL = API_IMG_URL;
  isLoading: boolean = true;
  isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private reviewService: ReviewService,
    private authService: AuthService,
    private userService: UsersService,
  ) {
    this.isAuthenticated = authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.businessId = +this.route.snapshot.paramMap.get('id')!;

    Promise.all([
      this.businessService.getBusinessById(this.businessId).toPromise(),
      this.serviceService.getServiceByBusinessId(this.businessId).toPromise(),
      this.userService.getProfile().toPromise(),
      this.getUserReviews()
    ]).then(([businessRes, serviceRes, usersRes]) => {
      this.business = businessRes?.data ?? null
      this.services = serviceRes?.data ?? []

      if (this.isAuthenticated) {
        this.userService.getProfile().subscribe((res) => {
          this.user = usersRes?.data ?? null;
        });
      }
    }).finally(() => {
      this.isLoading = false;
    })

    AOS.init({
      duration: 800,
      once: false,
    });
  }

  openUserInfoDialog(review: IReview) {
      this.dialog.open(UserInfoDialogComponent, {
        width: '400px',
        data: review.user_id,
      });
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
    this.reviewService.getByBookingBusinessId(this.businessId, EReviewType.BUSINESS).subscribe(res => {
      this.reviews = res.data ?? [];
    });
  }

  hasReview(businessId: number): boolean {
    return this.reviews.some(review => review.booking_business_id === businessId && review.type === EReviewType.BUSINESS && review.user_id === this.user?.id);
  }
}
