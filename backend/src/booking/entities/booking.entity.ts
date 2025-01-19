import { EBookingStatuses } from '../../shared/enums/booking-statuses.enum';
import { IBooking } from '../../shared/interfaces/booking.interface';

export class BookingEntity implements IBooking {
  id?: number;
  datetime: Date;
  user_id: number;
  business_id: number;
  service_id: number;
  description: string;
  status: EBookingStatuses;
  amount?: number;

  constructor(booking: IBooking) {
    this.id = booking.id;
    this.datetime = booking.datetime;
    this.user_id = booking.user_id;
    this.business_id = booking.business_id;
    this.service_id = booking.service_id;
    this.description = booking.description;
    this.status = booking.status;
    this.amount = booking.amount;
  }
}
