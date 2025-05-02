import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { UserBookingsComponent } from '../components/user-bookings/user-bookings.component';
import { UserFavoritesComponent } from '../components/user-favorites/user-favorites.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { IUser } from '../core/interfaces/user.interface';
import { AuthService } from '../core/services/auth.service';
import { UsersService } from '../core/services/users.service';
import { BusinessInfoComponent } from '../components/business-info/business-info.component';
import { BusinessBookingsComponent } from '../components/business-bookings/business-bookings.component';
import { BusinessPostsComponent } from '../components/business-posts/business-posts.component';
import * as AOS from 'aos';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    UserInfoComponent,
    UserBookingsComponent,
    UserFavoritesComponent,
    BusinessInfoComponent,
    BusinessBookingsComponent,
    BusinessPostsComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  user: IUser | null = null;
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService, private userService: UsersService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isAuthenticated();

    if (this.isLoggedIn) {
      this.userService.getProfile().subscribe((res) => {
        this.user = res.data ?? null;
      })
    }

    AOS.init({
      duration: 800,
      once: false,
    });
  }
}
