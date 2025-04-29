import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { Immobilier } from '../../../models/immobilier.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  standalone: false,
  styleUrls: ['./admin-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ]),
    trigger('dialogAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.9)'
      })),
      transition('void <=> *', animate('200ms ease-in-out'))
    ])
  ]
})
export class AdminListComponent implements OnInit {
  immobiliers: Immobilier[] = [];
  showDeleteNotification = false;
  showConfirmationDialog = false;
  notificationTimeout: any;
  propertyToDelete: number | null = null;

  constructor(
    private service: ImmobilierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadImmobiliers();
  }

  loadImmobiliers(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.immobiliers = data.map(item => {
          return {
            ...item,
            photoPath: this.normalizePhotoPath(item.photoPath)
          };
        });

        console.log('Immobiliers chargés:', this.immobiliers);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/detail', id]);
  }

  deleteProperty(id: number | undefined): void {
    if (id !== undefined) {
      this.propertyToDelete = id;
      this.showConfirmationDialog = true;
    }
  }

  confirmDelete(): void {
    if (this.propertyToDelete) {
      this.service.deleteImmobilier(this.propertyToDelete).subscribe({
        next: () => {
          this.immobiliers = this.immobiliers.filter(item => item.id !== this.propertyToDelete);
          this.showConfirmationDialog = false;
          this.showDeleteNotification = true;
          
          if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
          }
          this.notificationTimeout = setTimeout(() => {
            this.hideNotification();
          }, 3000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.showConfirmationDialog = false;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmationDialog = false;
    this.propertyToDelete = null;
  }

  hideNotification(): void {
    this.showDeleteNotification = false;
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }

  normalizePhotoPath(photoPath: string | undefined): string | undefined {
    if (!photoPath) return undefined;

    if (typeof photoPath === 'string' && (photoPath.startsWith('[') || photoPath.startsWith('{'))) {
      try {
        const parsed = JSON.parse(photoPath);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        } else if (typeof parsed === 'string') {
          return parsed;
        }
      } catch (e) {
        console.warn('Impossible de parser photoPath:', photoPath);
      }
    }

    return photoPath;
  }

  getImageUrl(photoPath: string | undefined, itemId?: number): string {
    if (photoPath) {
      const normalizedPath = this.normalizePhotoPath(photoPath) || photoPath;
      if (normalizedPath.startsWith('/uploads/')) {
        const fullUrl = `http://localhost:8081${normalizedPath}`;
        return fullUrl;
      }

      if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
        return normalizedPath;
      }
    }

    return 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600';
  }

  getBackgroundStyle() {
    return {
      'background-image': 'url(assets/images/background.jpg)',
      'background-size': 'cover',
      'background-position': 'center',
      'min-height': '100vh',
      'padding': '20px'
    };
  }
}
