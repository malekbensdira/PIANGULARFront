import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { Immobilier } from '../../../models/immobilier.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EstimationService } from '../../../services/estimation.service';

interface FlyingKey {
  left: number;
  top: number;
  rotation: number;
  delay: number;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: false,
  styleUrls: ['./list.component.css'],
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
export class ListComponent implements OnInit {
  immobiliers: Immobilier[] = [];
  showDeleteNotification = false;
  showConfirmationDialog = false;
  notificationTimeout: any;
  propertyToDelete: number | null = null;

   

  constructor(
    private service: ImmobilierService,
    private router: Router,
    private estimationService: EstimationService
  ) {}

  ngOnInit(): void {
    this.loadImmobiliers();
  }

  loadImmobiliers(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        // Traitement des données pour s'assurer que les chemins d'images sont corrects
        this.immobiliers = data.map(item => {
          return {
            ...item,
            // Normaliser le chemin de la photo principale
            photoPath: this.normalizePhotoPath(item.photoPath)
          };
        });
        
        console.log('Immobiliers chargés:', this.immobiliers);
        // Vérifier les valeurs de photoPath reçues
        this.immobiliers.forEach(item => {
          console.log(`Bien ID:${item.id}, photoPath:${item.photoPath}`);
        });
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  viewDetails(id: number): void {
    this.router.navigate(['/detail', id]);
  }
  

  estimateProperty(item: Immobilier): void {
    this.router.navigate(['/estimate'], {
      state: {
        propertyData: {
          typeImmobilier: item.type,
          superficie: item.superficie,
          latitude: item.latitude,
          longitude: item.longitude,
          nombrePieces: item.nombrePieces || 0 // Valeur par défaut si non défini
        }
      }
    });
  }

  goToEstimate(): void {
    this.router.navigate(['/estimate']);
  }

  // Méthode pour normaliser les chemins d'images
  normalizePhotoPath(photoPath: string | undefined): string | undefined {
    if (!photoPath) return undefined;
    
    // Si c'est une chaîne JSON, essayer de l'extraire
    if (typeof photoPath === 'string' && 
        (photoPath.startsWith('[') || photoPath.startsWith('{'))) {
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

  editProperty(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/edit', id]);
    }
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

  // Méthode pour gérer les chemins d'images
  getImageUrl(photoPath: string | undefined, itemId?: number): string {
    console.log(`Traitement de l'image pour ID:${itemId}, photoPath initial:`, photoPath);
    
    // SOLUTION RADICALE: D'abord vérifier dans le localStorage
    if (itemId) {
      const localStorageContent = localStorage.getItem('immobilier_images');
      console.log('Contenu complet du localStorage:', localStorageContent);
      
      const imageMapping = JSON.parse(localStorageContent || '{}');
      console.log('Mapping des images:', imageMapping);
      
      if (imageMapping[itemId]) {
        const localStoragePath = imageMapping[itemId];
        console.log(`Image trouvée dans localStorage pour ID:${itemId}:`, localStoragePath);
        
        // Si le chemin commence par /uploads, c'est une image stockée sur le serveur
        if (localStoragePath.startsWith('/uploads/')) {
          const fullUrl = `http://localhost:8081${localStoragePath}`;
          console.log('URL serveur complète:', fullUrl);
          return fullUrl;
        }
        
        return localStoragePath;
      } else {
        console.log(`Aucune image trouvée dans localStorage pour ID:${itemId}`);
      }
    }
    
    // Si photoPath est défini, l'utiliser
    if (photoPath) {
      console.log('Utilisation du photoPath fourni:', photoPath);
      
      // Normaliser le chemin si nécessaire
      const normalizedPath = this.normalizePhotoPath(photoPath) || photoPath;
      
      // Si le chemin commence par /uploads, c'est une image stockée sur le serveur
      if (normalizedPath.startsWith('/uploads/')) {
        const fullUrl = `http://localhost:8081${normalizedPath}`;
        console.log('URL serveur complète:', fullUrl);
        return fullUrl;
      }
      
      // Si c'est déjà une URL complète
      if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
        return normalizedPath;
      }
    }
    
    // S'il n'y a pas de photoPath, on utilise une image par défaut
    console.log(`Aucune image trouvée pour ID:${itemId}, utilisation de l'image par défaut`);
    return 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600';
  }

  // Style d'arrière-plan
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