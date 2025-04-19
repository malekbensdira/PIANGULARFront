import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  constructor(private router: Router) {}

  resetByEmail() {
    this.router.navigate(['/reset-email']);  }

  resetBySms() {
    this.router.navigate(['/reset-password'], { queryParams: { method: 'sms' } });
  }
}
