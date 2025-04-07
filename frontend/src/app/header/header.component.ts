import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../components/register-dialog/register-dialog.component';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { API_IMG_URL } from '../core/constants/api-url';
import { IUser } from '../core/interfaces/user.interface';
import { UsersService } from '../core/services/users.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  API_IMG_URL = API_IMG_URL;
  user: IUser | null = null;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
      this.isLoggedIn = this.authService.isAuthenticated();

      if (this.isLoggedIn) {
        this.userService.getProfile().subscribe((res) => {
          this.user = res.data ?? null;
        })
      }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.user = null;
    })
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  openRegister(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'login') this.openLogin(); // откроем логин по клику из регистрации
    });
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'register') this.openRegister();
    });
  }
}
