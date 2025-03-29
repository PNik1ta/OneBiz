import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../core/services/auth.service';
import { ILoginUserDto } from '../../core/dto/auth/login-user.dto';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class LoginDialogComponent {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 4000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }

  login() {
    if (this.form.invalid) return;

    const dto: ILoginUserDto = this.form.value;
    this.isLoading = true;

    this.authService.login(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.showMessage('Успешный вход!');
        this.dialogRef.close();
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.isLoading = false;
        this.showMessage('Ошибка входа. Проверьте данные', true);
      }
    });
  }

  switchToRegister() {
    this.dialogRef.close('register');
  }
}
