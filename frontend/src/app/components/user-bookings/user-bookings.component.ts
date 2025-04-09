import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { IBooking } from '../../core/interfaces/booking.interface';
import { BookingService } from '../../core/services/booking.service';
import { IUpdateBookingDto } from '../../core/dto/booking/update-booking.dto';
import { EBookingStatuses } from '../../core/enums/booking-statuses.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-bookings',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.scss'
})
export class UserBookingsComponent implements OnInit {
  @Input() user: IUser | null = null;
  bookings: IBooking[] = [];
  filteredBookings: IBooking[] = [];

  statusFilter: string = 'ALL';
  dateFrom: string = '';
  dateTo: string = '';

  constructor(private readonly bookingService: BookingService) { }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings() {
    this.bookingService.getUserBookings().subscribe((res) => {
      const now = new Date();

      this.bookings = (res.data ?? [])
        //.filter(booking => new Date(booking.datetime) > now)
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

      this.applyFilters();
    });
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

  cancelBooking(booking: IBooking) {
    const dto: IUpdateBookingDto = {
      datetime: booking.datetime,
      service_id: booking.service_id,
      description: booking.description,
      status: EBookingStatuses.CANCELED,
      amount: booking.amount,
    }
    this.bookingService.updateBooking(dto, booking.id!).subscribe(() => {
      this.getBookings();
    })
  }
}
