import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { Immobilier, TypeImmobilier } from '../../../models/immobilier.model';

@Component({
  selector: 'app-edit',
  standalone:false,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  property: Immobilier = {
    id: 0,
    type: TypeImmobilier.APPARTEMENT,
    prix: 0,
    superficie: 0,
    latitude: 0,
    longitude: 0,
    ville: '',
    anneeConstruction: 0,
    distanceCentre: 0,
    distanceEcoles: 0,
    etat: '',
    nombrePieces: 0,
    etage: 0
  };

  typeImmobilierOptions = Object.values(TypeImmobilier);
  isLoading = false;
  errorMessage: string | null = null;
isEditMode: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ImmobilierService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isLoading = true;
      this.service.getById(+id).subscribe({
        next: (data) => {
          this.property = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Impossible de charger les données du bien';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.property.id) {
      this.errorMessage = 'ID du bien non valide';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.service.updateImmobilier(this.property.id, this.property)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/list'], {
            queryParams: { refresh: new Date().getTime() } // Force le rafraîchissement
          });
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Échec de la mise à jour. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/list']);
  }
}