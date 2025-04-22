import { Component, OnInit } from '@angular/core';
import { ImmobilierService } from '../../../services/immobilier.service';
import { Router } from '@angular/router';
import { TypeImmobilier } from '../../../models/immobilier.model';
import { catchError, lastValueFrom, take, throwError } from 'rxjs';

@Component({
  selector: 'app-add-immobilier',
  templateUrl: './add.component.html',
  standalone: false,
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  newImmobilier = {
    type: TypeImmobilier.APPARTEMENT,
    prix: 0,
    superficie: 0,
    latitude: 0,
    longitude: 0,
    ville: '',
    anneeConstruction: new Date().getFullYear(),
    distanceCentre: 0,
    nombre_pieces: 0,      
  distance_centre: 0,    
  distance_ecoles: 0,
    distanceEcoles: 0,
    etat: 'NEUF',
    nombrePieces: 0,
    etage: 0
  };

  typeImmobilierOptions = Object.values(TypeImmobilier);
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isSubmitting = false;
  errorMessage: string | null = null;
  isLocating = false;
  estimationLoading = false;
  predictedPrice: number | null = null;
  estimationError: string | null = null;

  constructor(
    private immobilierService: ImmobilierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files?.length) {
      this.selectedFiles = Array.from(files);
      this.previewUrls = [];
      this.selectedFiles.forEach(file => {
        if (!file.type.match('image.*')) {
          this.errorMessage = 'Seuls les fichiers images sont acceptés';
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => this.previewUrls.push(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    this.errorMessage = null;

    try {
      const formData = new FormData();
      
      // Ajoutez les données JSON
      formData.append('immobilier', JSON.stringify(this.newImmobilier));
      
      // Modification clé : utiliser 'photos' au lieu de 'files' pour correspondre au backend
      this.selectedFiles.forEach(file => {
        formData.append('photos', file, file.name); // ⚠️ Changé à 'photos'
      });

      await lastValueFrom(
        this.immobilierService.createWithImages(formData).pipe(
          take(1),
          catchError(error => throwError(() => new Error(error.message)))
        )
      );
      
      this.router.navigate(['/list']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erreur lors de la création';
      console.error('Erreur:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  estimatePrice(): void {
    if (!this.validateEstimationFields()) {
      this.estimationError = 'Veuillez remplir tous les champs requis';
      return;
    }
  
    this.estimationLoading = true;
    this.estimationError = null;
  
    const estimationData = {
      type: this.newImmobilier.type,
      superficie: this.newImmobilier.superficie,
      latitude: this.newImmobilier.latitude,
      longitude: this.newImmobilier.longitude,
      nombrePieces: this.newImmobilier.nombrePieces,
      distanceCentre: this.newImmobilier.distanceCentre,
      distanceEcoles: this.newImmobilier.distanceEcoles
    };
  
    this.immobilierService.estimatePrice(estimationData).subscribe({
      next: (response: any) => {
        this.predictedPrice = response.predicted_price;
        // Ajout d'une vérification pour éviter d'assigner null
        if (this.predictedPrice !== null) {
          this.newImmobilier.prix = this.predictedPrice;
        } else {
          this.estimationError = 'Impossible d\'estimer le prix';
        }
      },
      error: (err) => {
        this.estimationError = err.error?.error || 'Erreur lors de l\'estimation';
      },
      complete: () => {
        this.estimationLoading = false;
      }
    });
  }

  private validateEstimationFields(): boolean {
    return !!this.newImmobilier.superficie && 
           !!this.newImmobilier.latitude && 
           !!this.newImmobilier.longitude;
  }

  getCurrentLocation(): void {
    this.isLocating = true;
    this.errorMessage = '';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.newImmobilier.latitude = parseFloat(position.coords.latitude.toFixed(6));
          this.newImmobilier.longitude = parseFloat(position.coords.longitude.toFixed(6));
          this.isLocating = false;
        },
        (error) => {
          this.errorMessage = 'Impossible d\'obtenir votre position. Veuillez saisir manuellement.';
          this.isLocating = false;
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      this.errorMessage = 'Géolocalisation non supportée par votre navigateur';
      this.isLocating = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/list']);
  }
}