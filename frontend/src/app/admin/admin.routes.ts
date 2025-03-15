import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BusinessesComponent } from './business/business.component';
import { TagsComponent } from './tags/tags.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'businesses', component: BusinessesComponent },
      { path: 'tags', component: TagsComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
