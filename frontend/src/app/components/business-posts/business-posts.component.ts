import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-business-posts',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './business-posts.component.html',
  styleUrl: './business-posts.component.scss'
})
export class BusinessPostsComponent {
  @Input() user: IUser | null = null;


}
