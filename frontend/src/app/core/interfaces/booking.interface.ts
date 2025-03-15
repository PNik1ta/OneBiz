import { EBookingStatuses } from "../enums/booking-statuses.enum";

export interface IBooking {
  id?: number;
  datetime: Date;
  user_id: number;
  business_id: number;
  service_id: number;
  description: string;
  status: EBookingStatuses;
  amount?: number;
}
