import { Component, OnInit } from '@angular/core';
import { ImmobilierService } from '../../../services/immobilier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeImmobilier } from '../../../models/immobilier.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-immobilier',
  templateUrl: './add.component.html',
  standalone: false,
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  newImmobilier: any = {
    type: TypeImmobilier.APPARTEMENT,
    prix: 0,
    superficie: 0,
    latitude: 0,
    longitude: 0,
    ville: '',
    annee_construction: new Date().getFullYear(),
    distance_centre: 0,
    distance_ecoles: 0,
    etat: 'NEUF',
    nombre_pieces: 0,
    etage: 0,
    images: []
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
    private service: ImmobilierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
    console.log('Types disponibles:', this.typeImmobilierOptions);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Réinitialiser les tableaux
      this.selectedFiles = Array.from(files);
      this.previewUrls = [];
      
      // Pour chaque fichier, créer une prévisualisation
      this.selectedFiles.forEach((file, index) => {
        console.log(`Traitement du fichier ${index}:`, file.name, file.type);
        
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          const base64Image = e.target.result;
          console.log(`Prévisualisation générée pour ${file.name} (20 premiers caractères):`, 
            base64Image.substring(0, 20) + '...');
          this.previewUrls.push(base64Image);
          
          // Stocker directement l'image dans localStorage pour le test
          const testKey = 'test_' + file.name.replace(/[^a-z0-9]/gi, '_');
          localStorage.setItem(testKey, base64Image);
          console.log(`Image stockée pour test avec clé: ${testKey}`);
        };
        
        reader.onerror = (e) => {
          console.error(`Erreur lors de la lecture du fichier ${file.name}:`, e);
        };
        
        reader.readAsDataURL(file);
      });
    } else {
      console.warn('Aucun fichier sélectionné');
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = null;
    console.log('Démarrage de la soumission avec', this.selectedFiles.length, 'images');

    // Si des fichiers sont sélectionnés, uploader les images d'abord
    if (this.selectedFiles.length > 0) {
      console.log('Envoi des images au serveur...');
      this.service.uploadImages(this.selectedFiles).subscribe({
        next: (imagePaths: string[]) => {
          console.log('Images téléchargées avec succès:', imagePaths);
          
          // Traiter chaque chemin pour s'assurer qu'il est dans le bon format
          const processedPaths = imagePaths.map((path: string) => {
            // Si la chaîne est un JSON, essayer de l'extraire
            if (typeof path === 'string' && path.startsWith('[')) {
              try {
                const parsed = JSON.parse(path);
                return Array.isArray(parsed) ? parsed[0] : parsed;
              } catch (e) {
                console.warn('Impossible de parser le chemin d\'image:', path);
                return path;
              }
            }
            return path;
          });
          
          console.log('Chemins traités:', processedPaths);
          
          // Assignation directe du tableau de chemins traités
          this.newImmobilier.images = processedPaths;
          
          // Utiliser la première image comme photo principale
          if (processedPaths.length > 0) {
            this.newImmobilier.photoPath = processedPaths[0];
            console.log('Photo principale définie:', this.newImmobilier.photoPath);
          }
          
          // Ajouter le bien avec les images
          this.service.addImmobilier(this.newImmobilier).subscribe({
            next: (response) => {
              console.log('Bien ajouté avec succès, réponse:', response);
              this.router.navigate(['/list']);
            },
            error: (err) => {
              console.error('Erreur détaillée:', err);
              this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout du bien';
              this.isSubmitting = false;
            }
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message;
          console.error('Erreur d\'upload des images:', error);
        }
      });
    } else {
      // Continuer sans upload d'image
      console.log('Aucune image à télécharger, création directe de la propriété');
      this.service.addImmobilier(this.newImmobilier).subscribe({
        next: (response) => {
          console.log('Bien ajouté avec succès, réponse:', response);
          this.router.navigate(['/list']);
        },
        error: (err) => {
          console.error('Erreur détaillée:', err);
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout du bien';
          this.isSubmitting = false;
        }
      });
    }
  }

  // Nouvelle méthode pour l'estimation
  estimatePrice(): void {
    if (!this.newImmobilier.superficie || !this.newImmobilier.latitude || !this.newImmobilier.longitude) {
      this.estimationError = 'Veuillez remplir la superficie et les coordonnées GPS';
      return;
    }

    this.estimationLoading = true;
    this.estimationError = '';
    this.predictedPrice = null;

    const estimationData = {
      type: this.newImmobilier.type,
      superficie: this.newImmobilier.superficie,
      latitude: this.newImmobilier.latitude,
      longitude: this.newImmobilier.longitude,
      nombrePieces: this.newImmobilier.nombre_pieces,
      distanceCentre: this.newImmobilier.distance_centre,
      distanceEcoles: this.newImmobilier.distance_ecoles
    };

    this.service.estimatePrice(estimationData).subscribe({
      next: (response: any) => {
        this.predictedPrice = response.predicted_price;
        this.newImmobilier.prix = this.predictedPrice;
      },
      error: (err) => {
        this.estimationError = err.error?.error || 'Erreur lors de l\'estimation';
      },
      complete: () => {
        this.estimationLoading = false;
      }
    });
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
  // add.component.ts
uploadFiles() {
  this.isUploading = true;
  this.uploadProgress = 0;
  this.errorMessage = '';

  this.immobilierService.uploadImages(this.selectedFiles).subscribe({
    next: (imageUrls: string[]) => {
      this.isUploading = false;
      this.uploadProgress = 100;
      this.newImmobilier.images = imageUrls;
      this.uploadSuccess = true;
    },
    error: (err: Error) => {
      this.isUploading = false;
      this.errorMessage = err.message;
      console.error('Échec de l\'upload:', err);
      // Affichez un message à l'utilisateur
      this.showErrorToast(err.message);
    }
  });
}

  cancel(): void {
    this.router.navigate(['/list']);
  }
}