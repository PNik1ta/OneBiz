import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IBooking } from '../../core/interfaces/booking.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-booking-details',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IBooking,
    private dialogRef: MatDialogRef<BookingDetailsComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
