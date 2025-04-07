import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { API_IMG_URL } from '../../core/constants/api-url';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  @Input() user: IUser | null = null;
  API_IMG_URL = API_IMG_URL;
}
