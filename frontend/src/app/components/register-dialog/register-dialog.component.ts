import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IRegisterUserDto } from '../../core/dto/auth/register-user.dto';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ERoles } from '../../core/enums/roles.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
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
export class RegisterDialogComponent {
  form: FormGroup;
  ERoles = ERoles;
  codeSent = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required],
      code: [{ value: '', disabled: true }, Validators.required]
    });
  }

  showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: 4000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }

  sendCode() {
    const email = this.form.get('email')?.value;

    if (!email || this.form.get('email')?.invalid) return;

    this.isLoading = true;
    this.authService.sendVerificationCode({ email }).subscribe({
      next: () => {
        this.form.get('code')?.enable();
        this.codeSent = true;
        this.showMessage('Код отправлен на email');
        this.isLoading = false;
      },
      error: err => {
        this.showMessage('Ошибка отправки кода', true);
        this.isLoading = false;
      }
    });
  }

  register() {
    if (this.form.invalid || !this.codeSent) return;

    const dto: IRegisterUserDto = this.form.getRawValue();
    this.isLoading = true;

    this.authService.register(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.showMessage('Успешная регистрация!');
        this.dialogRef.close('success');
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.isLoading = false;
        this.showMessage('Ошибка регистрации', true);
      }
    });
  }

  switchToLogin() {
    this.dialogRef.close('login');
  }
}
