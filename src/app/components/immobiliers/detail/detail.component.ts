import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { EstimationService } from '../../../services/estimation.service';
import { Immobilier } from '../../../models/immobilier.model';
import { Router } from '@angular/router';
import { PdfService } from '../../../services/generate-pdf.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone: false,
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  mapsLink: string = '';
  property: Immobilier | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  googleMapsLink: string | null = null;
  showMapModal = false;
  showMap = false;
  recommendedProperties: Immobilier[] = [];
  map: L.Map | null = null;
  marker!: L.Marker;
  hoveredProperty: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private immobilierService: ImmobilierService,
    private estimationService: EstimationService,
    private router: Router,
    private pdfService: PdfService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(+id);
    }
  }

  loadProperty(id: number): void {
    this.isLoading = true;
    this.immobilierService.getById(id).subscribe({
      next: (data) => {
        this.property = {
          ...data,
          photoPath: this.normalizePhotoPath(data.photoPath)
        };
        console.log('Bien chargé:', this.property);
        this.loadSimilarProperties(data);
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = 'Erreur lors du chargement du bien';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  loadSimilarProperties(currentProperty: Immobilier): void {
    const payload = {
      superficie: currentProperty.superficie,
      latitude: currentProperty.latitude,
      longitude: currentProperty.longitude,
      nombrePieces: currentProperty.nombrePieces,
      distanceCentre: currentProperty.distanceCentre || 2.5,
      distanceEcoles: currentProperty.distanceEcoles || 0.8
    };

    console.log('Payload envoyé à /recommend:', payload);

    this.estimationService.recommanderBien(payload).subscribe({
      next: (response: any) => {
        console.log('Réponse brute de /recommend:', response);
        const properties = response.recommended_properties || [];
        console.log('Propriétés reçues:', properties);
        if (Array.isArray(properties)) {
          this.recommendedProperties = properties.map((prop, index) => ({
            ...prop,
            id: prop.id || index + 1,
            type: prop.type || prop.type_immobilier || 'Inconnu',
            ville: prop.ville || 'Inconnue',
            superficie: prop.superficie || 0,
            prix: prop.prix || 0,
            photoPath: this.normalizePhotoPath(prop.photoPath) || null,
            latitude: prop.latitude || 0,
            longitude: prop.longitude || 0,
            nombrePieces: prop.nombrePieces || 0,
            distanceCentre: prop.distanceCentre || 0,
            distanceEcoles: prop.distanceEcoles || 0,
            anneeConstruction: prop.anneeConstruction || null,
            etage: prop.etage || null,
            etat: prop.etat || null
          }));
          console.log('Biens similaires assignés:', this.recommendedProperties);
        } else {
          console.warn('Les données des biens similaires ne sont pas un tableau:', properties);
          this.recommendedProperties = [];
        }
      },
      error: (err: Error) => {
        console.warn('Erreur lors du chargement des biens similaires:', err);
        this.recommendedProperties = [];
      }
    });
  }

  loadLeafletMap(): void {
    if (!this.property || this.map) return;

    const { latitude, longitude, ville, type } = this.property;

    this.map = L.map('leaflet-map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/img/building.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    this.marker = L.marker([latitude, longitude], {
      icon: customIcon,
      draggable: false
    }).addTo(this.map)
      .bindPopup(`${type} à ${ville}`)
      .openPopup();
  }

  onLoadMapClick(): void {
    this.showMap = true;
    setTimeout(() => this.loadLeafletMap(), 300);
  }

  buyProperty(): void {
    if (!this.property) return;

    const nomAcheteur = prompt("Nom complet de l'acheteur:");
    const cinAcheteur = prompt("CIN de l'acheteur:");
    const nomVendeur = prompt("Nom complet du vendeur:");
    const cinVendeur = prompt("CIN du vendeur:");

    if (!nomAcheteur || !cinAcheteur || !nomVendeur || !cinVendeur) {
      alert('Toutes les informations sont requises!');
      return;
    }

    const contractData = {
      type_immobilier: this.property.type,
      superficie: this.property.superficie,
      latitude: this.property.latitude,
      longitude: this.property.longitude,
      nombrePieces: this.property.nombrePieces,
      distanceCentre: 2.5,
      distanceEcoles: 0.8,
      nom_acheteur: nomAcheteur,
      cin_acheteur: cinAcheteur,
      nom_vendeur: nomVendeur,
      cin_vendeur: cinVendeur
    };

    this.pdfService.generateContract(contractData).subscribe(
      (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contrat_achat.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error => {
        console.error('Erreur génération PDF:', error);
        alert('Erreur lors de la génération du contrat');
      }
    );
  }

  getMapsLink(id: number) {
    this.http.get('http://localhost:8081/api/immobilier/maps/' + id, { responseType: 'text' })
      .subscribe(
        (link: string) => {
          this.mapsLink = link;
          window.open(this.mapsLink, '_blank');
        },
        (error: any) => {
          console.error('Erreur lors de la récupération du lien Google Maps', error);
        }
      );
  }

  closeMapModal(): void {
    this.showMapModal = false;
    this.googleMapsLink = null;
  }

  normalizePhotoPath(photoPath: string | undefined): string | undefined {
    if (!photoPath) return undefined;

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

  getImageUrl(photoPath: string | undefined): string {
    if (!photoPath) {
      return 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600';
    }

    if (photoPath.startsWith('http')) {
      return photoPath;
    }

    if (photoPath.startsWith('/uploads/')) {
      return `http://localhost:8081${photoPath}`;
    }

    return photoPath;
  }

  viewDetails(id: number): void {
    console.log('Tentative de navigation vers ID:', id); // Log pour déboguer
    // this.router.navigate(['/detail', id]); // Commenté car les ID temporaires ne sont pas valides
  }
}