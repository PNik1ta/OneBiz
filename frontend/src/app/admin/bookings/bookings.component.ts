import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { IBooking } from '../../core/interfaces/booking.interface';
import { BookingService } from '../../core/services/booking.service';
import { BookingDialogComponent } from './bookings-dialog/bookings-dialog.component';

@Component({
  standalone: true,
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class BookingsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'datetime', 'user_id', 'business_id', 'service_id', 'description', 'status', 'amount', 'actions'];
  dataSource = new MatTableDataSource<IBooking>([]);

  constructor(private bookingService: BookingService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe(bookings => {
      this.dataSource.data = bookings.data ?? [];
    });
  }

  addBooking(): void {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: { booking: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBookings();
    });
  }

  editBooking(booking: IBooking): void {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: { booking },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBookings();
    });
  }

  deleteBooking(id: number): void {
    if (confirm('Удалить запись?')) {
      this.bookingService.deleteBooking(id).subscribe(() => this.loadBookings());
    }
  }
}
