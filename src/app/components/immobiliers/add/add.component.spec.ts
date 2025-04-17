import { Component, OnInit } from '@angular/core';
import { ImmobilierService } from '../../../services/immobilier.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-immobilier',
  templateUrl: './add.component.html',
  standalone: false,
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
document: any;
[x: string]: any;
cancel() {
throw new Error('Method not implemented.');
}
  newImmobilier: any = {
    type: 'APPARTEMENT',
    prix: null,
    superficie: null,
    ville: '',
    latitude: null,
    longitude: null,
    annee_construction: new Date().getFullYear(),
    distance_centre: 5,
    distance_ecoles: 2,
    etat: 'NEUF',
    nombre_pieces: 1,
    etage: 0,
    photoPath: '/assets/default.jpg'
  };

  isSubmitting = false;
  isLocating = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
immobilierForm: any;
isLoading: any;
previewUrl: any;


  constructor(private immoService: ImmobilierService) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      
      // Mettre à jour le chemin de la photo
      this.newImmobilier.photoPath = this.selectedFile.name;
    }
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
          console.error('Erreur de géolocalisation:', error);
          this.errorMessage = 'Impossible d\'obtenir votre position. Veuillez saisir manuellement.';
          this.isLocating = false;
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      this.errorMessage = 'La géolocalisation n\'est pas supportée par votre navigateur';
      this.isLocating = false;
    }
  }

  onSubmit(): void {
    if (!this.newImmobilier.latitude || !this.newImmobilier.longitude) {
      this.errorMessage = 'Les coordonnées GPS sont obligatoires';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Créer FormData pour envoyer les données + fichier
    const formData = new FormData();
    
    // Ajouter toutes les propriétés de newImmobilier
    Object.keys(this.newImmobilier).forEach(key => {
      formData.append(key, this.newImmobilier[key]);
    });
    
    // Ajouter le fichier image s'il existe
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    console.log('Envoi des données:', formData);

    this.immoService.addImmobilier(formData).subscribe({
      next: (res) => {
        console.log('Réponse du serveur:', res);
        this.isSubmitting = false;
        alert('Bien immobilier ajouté avec succès !');
        this.resetForm();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur:', err);
        this.isSubmitting = false;
        
        if (err.status === 400) {
          this.errorMessage = 'Données invalides: ' + (err.error.message || JSON.stringify(err.error));
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else {
          this.errorMessage = 'Erreur serveur: ' + err.message;
        }
      }
    });
  }

  resetForm(): void {
    this.newImmobilier = {
      type: 'APPARTEMENT',
      prix: null,
      superficie: null,
      ville: '',
      latitude: null,
      longitude: null,
      annee_construction: new Date().getFullYear(),
      distance_centre: 5,
      distance_ecoles: 2,
      etat: 'NEUF',
      nombre_pieces: 1,
      etage: 0,
      photoPath: '/assets/default.jpg'
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.getCurrentLocation();
  }
}