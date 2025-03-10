import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: MATERIAL_IMPORTS,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    console.log('here');

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/'])
      }
    })
  }
}
