import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BusinessPageComponent } from './business-page/business-page.component';
import { BusinessDetailPageComponent } from './business-detail-page/business-detail-page.component';
import { ServicePageComponent } from './service-page/service-page.component';
import { ServiceDetailPageComponent } from './service-detail-page/service-detail-page.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { PostDetailPageComponent } from './post-detail-page/post-detail-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'businesses', component: BusinessPageComponent },
  { path: 'business/:id', component: BusinessDetailPageComponent },
  { path: 'services', component: ServicePageComponent },
  { path: 'service/:id', component: ServiceDetailPageComponent },
  { path: 'blog', component: NewsPageComponent },
  { path: 'blog/:id', component: PostDetailPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.routes) },
];
