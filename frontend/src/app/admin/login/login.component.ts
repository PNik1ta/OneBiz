import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';

@Component({
  selector: 'app-login',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ошибка авторизации';
        this.loading = false;
      }
    });
  }
}
