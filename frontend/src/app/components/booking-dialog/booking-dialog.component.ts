import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookingService } from '../../core/services/booking.service';
import { ICreateBookingDto } from '../../core/dto/booking/create-booking.dto';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss'],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'DD.MM.YYYY' },
        display: {
          dateInput: 'dd.MM.yyyy',
          monthYearLabel: 'MMMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      },
    }
  ]
})
export class BookingDialogComponent implements OnInit {
  form: FormGroup;
  disabledDates: Date[] = [];
  availableTimeSlots: string[] = ['09:00', '11:00', '13:00', '15:00', '17:00'];
  filteredTimeSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { serviceId: number; businessId: number }
  ) {
    this.form = this.fb.group({
      date: [null, Validators.required],
      time: [null, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bookingService.getBookingsByBusinessId(this.data.businessId).subscribe(res => {
      const bookings = res.data ?? [];

      const groupedByDate: Record<string, string[]> = {};

      for (const booking of bookings) {
        const d = new Date(booking.datetime);
        const dateStr = d.toDateString();
        const timeStr = `${d.getHours().toString().padStart(2, '0')}:00`;

        if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];
        groupedByDate[dateStr].push(timeStr);
      }

      // Если все слоты заняты — добавим дату в disabledDates
      this.disabledDates = Object.entries(groupedByDate)
        .filter(([_, times]) =>
          this.availableTimeSlots.every(slot => times.includes(slot))
        )
        .map(([dateStr]) => new Date(dateStr));

      // Следим за выбором даты
      this.form.get('date')?.valueChanges.subscribe(date => {
        const dateStr = new Date(date).toDateString();
        const times = groupedByDate[dateStr] ?? [];

        this.filteredTimeSlots = this.availableTimeSlots.filter(slot => !times.includes(slot));
        this.form.get('time')?.setValue(null); // сбрасываем время при смене даты
      });
    });
  }

  isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // убираем часы

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const isPast = target < today;
    const isWeekend = target.getDay() === 0 || target.getDay() === 6; // 0 = Sunday, 6 = Saturday
    const isBusy = this.disabledDates.some(d => d.toDateString() === target.toDateString());

    return !(isPast || isWeekend || isBusy);
  };




  book(): void {
    if (this.form.invalid) return;

    const date: Date = this.form.value.date;
    const [hours, minutes] = this.form.value.time.split(':').map(Number);
    const datetime = new Date(date);
    datetime.setHours(hours, minutes, 0);

    const dto: ICreateBookingDto = {
      datetime: datetime.toISOString(),
      description: this.form.value.description,
      service_id: this.data.serviceId,
      business_id: this.data.businessId
    };

    this.bookingService.createBooking(dto).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
