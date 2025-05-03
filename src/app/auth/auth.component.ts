import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private zone: NgZone) {}

  ngOnInit(): void {
    console.log('AuthComponent initialized');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Current route:', event.url);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('AuthComponent destroyed');
  }

  login(): void {
    if (this.isLoading) return;

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez entrer un email et un mot de passe';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    console.log('Form values before login:', { email: this.email, password: this.password });
    console.log('Login request payload:', { email: this.email, mdp: this.password });

    this.authService.login(this.email, this.password).pipe(
      catchError(err => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Email ou mot de passe incorrect';
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (!response) return;
        this.isLoading = false;
        if (response.redirect) {
          console.log('Login successful:', response);
          this.authService.setAuthenticatedUser({ email: this.email, role: response.redirect });
          localStorage.setItem('email', this.email);
          console.log('Email enregistré dans le localStorage:', this.email);
          console.log('Form values after login:', { email: this.email, password: this.password });

          // Navigate with NgZone to ensure view updates
          this.zone.run(() => {
            setTimeout(() => {
              if (response.redirect === 'Back') {
                console.log('Navigating to /users-list');
                this.router.navigate(['/users-list'], { replaceUrl: true }).then(success => {
                  console.log('Navigation to /users-list successful:', success);
                  if (!success) {
                    console.error('Navigation failed, falling back to location.href');
                    this.errorMessage = 'Échec de la navigation. Redirection en cours...';
                    window.location.href = '/users-list';
                  }
                }).catch(err => {
                  console.error('Navigation error:', err);
                  this.errorMessage = 'Erreur lors de la navigation. Redirection en cours...';
                  window.location.href = '/users-list';
                });
              } else if (response.redirect === 'Front') {
                console.log('Navigating to /user');
                this.router.navigate(['/user'], { replaceUrl: true }).then(success => {
                  console.log('Navigation to /user successful:', success);
                  if (!success) {
                    console.error('Navigation failed, falling back to location.href');
                    this.errorMessage = 'Échec de la navigation. Redirection en cours...';
                    window.location.href = '/user';
                  }
                }).catch(err => {
                  console.error('Navigation error:', err);
                  this.errorMessage = 'Erreur lors de la navigation. Redirection en cours...';
                  window.location.href = '/user';
                });
              } else {
                this.errorMessage = 'Rôle inconnu. Veuillez contacter le support.';
                console.error('Unknown role:', response.redirect);
                this.isLoading = false;
              }
            }, 100);
          });
        } else if (response.error) {
          this.errorMessage = response.error;
          console.log('Login response error:', response.error);
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        console.log('Login subscription completed');
        this.isLoading = false;
      }
    });
  }
}