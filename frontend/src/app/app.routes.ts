import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.routes) },
];
