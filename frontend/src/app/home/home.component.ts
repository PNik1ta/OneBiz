import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { PlatformComponent } from './components/platform/platform.component';
import { CommunityComponent } from './components/community/community.component';
import { FaqComponent } from './components/faq/faq.component';
import { PathwaysComponent } from './components/pathways/pathways.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, PlatformComponent, CommunityComponent, FaqComponent, PathwaysComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
