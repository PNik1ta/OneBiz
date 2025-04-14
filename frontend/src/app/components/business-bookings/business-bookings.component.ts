import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { IUpdateBookingDto } from '../../core/dto/booking/update-booking.dto';
import { EBookingStatuses } from '../../core/enums/booking-statuses.enum';
import { IBooking } from '../../core/interfaces/booking.interface';
import { BookingService } from '../../core/services/booking.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IBusiness } from '../../core/interfaces/business.interface';
import { BusinessService } from '../../core/services/business.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateBookingStatusComponent } from '../update-booking-status/update-booking-status.component';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';


@Component({
  selector: 'app-business-bookings',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './business-bookings.component.html',
  styleUrl: './business-bookings.component.scss'
})
export class BusinessBookingsComponent {
  @Input() user: IUser | null = null;
  bookings: IBooking[] = [];
  filteredBookings: IBooking[] = [];
  business: IBusiness | null = null

  statusFilter: string = 'ALL';
  dateFrom: string = '';
  dateTo: string = '';

  constructor(
    private readonly bookingService: BookingService,
    private readonly businessService: BusinessService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getBusinessAndBookings();
  }

  openDetailsDialog(booking: IBooking): void {
    this.dialog.open(BookingDetailsComponent, {
      width: '400px',
      data: booking
    });
  }

  getBusinessAndBookings() {
    this.businessService.getUserBusiness().subscribe((res) => {
      this.business = res.data ?? null;

      if (this.business) {
        this.bookingService.getBookingsByBusinessId(this.business.id!).subscribe((res) => {
          const now = new Date();

          this.bookings = (res.data ?? [])
            // .filter(booking => new Date(booking.datetime) > now)
            .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

          this.applyFilters();
        });
      }
    });
  }

  getBookings() {
    if (this.business) {
      this.bookingService.getBookingsByBusinessId(this.business.id!).subscribe((res) => {
        const now = new Date();

        this.bookings = (res.data ?? [])
          // .filter(booking => new Date(booking.datetime) > now)
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

        this.applyFilters();
      });
    }
  }

  resetFilters(): void {
    this.statusFilter = 'ALL';
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
  }


  applyFilters(): void {
    const from = this.dateFrom ? new Date(this.dateFrom) : null;
    const to = this.dateTo ? new Date(this.dateTo) : null;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    this.filteredBookings = this.bookings.filter(booking => {
      const date = new Date(booking.datetime);

      const matchesStatus =
        this.statusFilter === 'ALL' || booking.status === this.statusFilter;

      const matchesDateFrom = !from || date >= from;
      const matchesDateTo = !to || date <= to;

      return matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }

  openStatusDialog(booking: IBooking): void {
    const dialogRef = this.dialog.open(UpdateBookingStatusComponent, {
      width: '400px',
      data: { currentStatus: booking.status }
    });

    dialogRef.afterClosed().subscribe((newStatus: EBookingStatuses) => {
      if (newStatus && newStatus !== booking.status) {
        const dto: IUpdateBookingDto = {
          datetime: booking.datetime,
          service_id: booking.service_id,
          description: booking.description,
          status: newStatus,
          amount: booking.amount,
        };
        this.bookingService.updateBooking(dto, booking.id!).subscribe(() => {
          this.getBookings();
        });
      }
    });
  }
}
