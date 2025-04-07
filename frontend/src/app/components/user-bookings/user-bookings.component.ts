import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-user-bookings',
  imports: [],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.scss'
})
export class UserBookingsComponent {
  @Input() user: IUser | null = null;
}
