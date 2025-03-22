import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { BookingService } from '../../../core/services/booking.service';
import { IUpdateBookingDto } from '../../../core/dto/booking/update-booking.dto';
import { ICreateBookingDto } from '../../../core/dto/booking/create-booking.dto';

@Component({
  standalone: true,
  selector: 'app-bookings-dialog',
  templateUrl: './bookings-dialog.component.html',
  styleUrls: ['./bookings-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class BookingDialogComponent {
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.bookingForm = this.fb.group({
      datetime: [data.booking?.datetime || '', Validators.required],
      business_id: [data.booking?.business_id || '', Validators.required],
      service_id: [data.booking?.service_id || '', Validators.required],
      description: [data.booking?.description || '', Validators.required],
      status: [data.booking?.status || ''],
      amount: [data.booking?.amount || '']
    });
  }

  // Метод сохранения пользователя
  saveBooking(): void {
    if (this.bookingForm.invalid) return;

    const bookingData = this.bookingForm.value;

    this.saveOrUpdateBooking(bookingData);
  }

  private saveOrUpdateBooking(bookingData: any): void {
    if (this.data.booking) {
      const dto: IUpdateBookingDto = {
        datetime: bookingData.datetime,
        service_id: bookingData.service_id,
        description: bookingData.descripion,
        status: bookingData.status,
        amount: bookingData.amount,
      }
      this.bookingService.updateBooking(dto, this.data.booking.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateBookingDto = {
        datetime: bookingData.datetime,
        service_id: bookingData.service_id,
        business_id: bookingData.business_id,
        description: bookingData.description,
      }
      console.log(dto);

      this.bookingService.createBooking(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
