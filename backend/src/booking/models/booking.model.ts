import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IBooking } from '../../shared/interfaces/booking.interface';
import { EBookingStatuses } from '../../shared/enums/booking-statuses.enum';

@Entity()
export class Booking implements IBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datetime: Date;

  @Column()
  user_id: number;

  @Column()
  business_id: number;

  @Column()
  service_id: number;

  @Column()
  description: string;

  @Column()
  status: EBookingStatuses;

  @Column()
  amount?: number;
}
