import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-user-favorites',
  imports: [],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.scss'
})
export class UserFavoritesComponent {
  @Input() user: IUser | null = null;
}
