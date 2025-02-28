import { EBookingStatuses } from "../../enums/booking-statuses.enum"

export interface IUpdateBookingDto {
  datetime: string
  service_id: number
  description: string
  status: EBookingStatuses
  amount?: number
}
