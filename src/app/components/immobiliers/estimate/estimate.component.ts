import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { TypeImmobilier } from '../../../models/immobilier.model';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css'],
  standalone: false
})
export class EstimateComponent {
  estimationData = {
    type: TypeImmobilier.APPARTEMENT,
    superficie: null as number | null,
    latitude: null as number | null,
    longitude: null as number | null,
    nombrePieces: null as number | null,
    distanceCentre: null as number | null,
    distanceEcoles: null as number | null
  };

  typeImmobilierOptions = Object.values(TypeImmobilier);
  isSubmitting = false;
  errorMessage: string | null = null;
  estimatedPrice: number | null = null;
  isLocating = false;

  constructor(
    private service: ImmobilierService,
    private router: Router
  ) {}

  getCurrentLocation(): void {
    this.isLocating = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.estimationData.latitude = position.coords.latitude;
          this.estimationData.longitude = position.coords.longitude;
          this.isLocating = false;
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          this.errorMessage = 'Impossible d\'obtenir votre position';
          this.isLocating = false;
        }
      );
    } else {
      this.errorMessage = 'La géolocalisation n\'est pas supportée par votre navigateur';
      this.isLocating = false;
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.estimatedPrice = null;

    // Vérifier que tous les champs requis sont remplis
    if (!this.estimationData.superficie || !this.estimationData.latitude || !this.estimationData.longitude) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.isSubmitting = false;
      return;
    }

    this.service.estimatePrice(this.estimationData).subscribe({
      next: (response) => {
        console.log('Réponse d\'estimation:', response);
        this.estimatedPrice = response.predicted_price;
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erreur d\'estimation:', error);
        this.errorMessage = error.message || 'Erreur lors de l\'estimation';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/list']);
  }
}