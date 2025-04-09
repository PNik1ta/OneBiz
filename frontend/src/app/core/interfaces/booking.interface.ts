import { EBookingStatuses } from "../enums/booking-statuses.enum";

export interface IBooking {
  id?: number;
  datetime: string;
  user_id: number;
  business_id: number;
  service_id: number;
  description: string;
  status: EBookingStatuses;
  amount?: number;
  company_name?: string;
  service?: string;
  service_amount?: string;
  service_discount?: string;
  username?: string;
  user_avatar_url?: string;
}
