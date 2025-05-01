import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { TypeImmobilier } from '../../../models/immobilier.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css'],
  standalone: false
})
export class EstimateComponent implements OnInit {
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

  map: any;
  marker: any;

  constructor(
    private service: ImmobilierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const defaultLat = this.estimationData.latitude || 36.8065; // centre Tunis
    const defaultLng = this.estimationData.longitude || 10.1815;
  
    this.map = L.map('map-estimate').setView([defaultLat, defaultLng], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    const customIcon = L.icon({
      iconUrl: 'assets/img/building.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  
    this.marker = L.marker([defaultLat, defaultLng], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);
  
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.estimationData.latitude = parseFloat(lat.toFixed(6));
      this.estimationData.longitude = parseFloat(lng.toFixed(6));
      this.marker.setLatLng([lat, lng]);
    });
  
    this.marker.on('dragend', (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      this.estimationData.latitude = parseFloat(lat.toFixed(6));
      this.estimationData.longitude = parseFloat(lng.toFixed(6));
    });
  }
  
  

  getCurrentLocation(): void {
    this.isLocating = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.estimationData.latitude = position.coords.latitude;
          this.estimationData.longitude = position.coords.longitude;

          this.marker.setLatLng([position.coords.latitude, position.coords.longitude]);
          this.map.setView([position.coords.latitude, position.coords.longitude], 13);

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
