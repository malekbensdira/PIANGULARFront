import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: '../header/header-after-signin.component.html',
  standalone:false,
  styleUrls: ['./header-after-signin.component.css']
})
export class HeaderComponent {
  activeRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url.split('/')[2] || 'list';
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/immobilier/${route}`]);
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }
}