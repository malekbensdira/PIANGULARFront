import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements AfterViewInit {
  role: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'User';
    });

    this.authService.getAuthStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const content = document.getElementById('content');
      if (content) {
        content.classList.add('visible');
      }
    }, 3000);
  }

  onLoginClick() {
    this.navigateToUserPage();
  }

  navigateToUserPage() {
    this.router.navigate(['/user']);
  }
}
