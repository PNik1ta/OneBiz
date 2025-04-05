import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BusinessPageComponent } from './business-page/business-page.component';
import { BusinessDetailPageComponent } from './business-detail-page/business-detail-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'businesses', component: BusinessPageComponent },
  { path: 'business/:id', component: BusinessDetailPageComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.routes) },
];
