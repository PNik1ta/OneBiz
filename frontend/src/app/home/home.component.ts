import { Component, OnInit, ViewChild } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { PlatformComponent } from './components/platform/platform.component';
import { CommunityComponent } from './components/community/community.component';
import { FaqComponent } from './components/faq/faq.component';
import { PathwaysComponent } from './components/pathways/pathways.component';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    PlatformComponent,
    CommunityComponent,
    FaqComponent,
    PathwaysComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  startFree() {
    if (this.isLoggedIn) {
      this.router.navigate(['/profile'])
    } else {
      this.onStartFree();
    }
  }

  onStartFree() {
    this.headerComponent.openRegister();
  }
}
