import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
  getAuthenticatedUser() {
    return { 
      email: 'admin@example.com', 
      role: 'Back' 
    };
  }
  
  isAuthenticated(): boolean {
    return true;
  }
}