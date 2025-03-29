import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../components/register-dialog/register-dialog.component';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn = false; // заменишь на свою логику
  isMenuOpen = false;

  constructor(private dialog: MatDialog) {}

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
