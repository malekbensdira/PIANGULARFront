import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImmobilierService } from '../../../services/immobilier.service';
import { Immobilier } from '../../../models/immobilier.model';
import { Router } from '@angular/router';
import { PdfService } from '../../../services/generate-pdf.service';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone:false,
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
viewDetails(arg0: any) {
throw new Error('Method not implemented.');
}
  property: Immobilier | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  
item: any;
recommendedProperties: any;

  constructor(
    private route: ActivatedRoute,
    private immobilierService: ImmobilierService,
    private router: Router,
    private pdfService: PdfService,
    
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(+id);
    }
  }

  buyProperty(): void {
    if (!this.property) return;
  
    // Demander les infos manquantes (acheteur/vendeur)
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
      distanceCentre: 2.5, // Valeur par défaut ou à récupérer
      distanceEcoles: 0.8, // Valeur par défaut ou à récupérer
      nom_acheteur: nomAcheteur,
      cin_acheteur: cinAcheteur,
      nom_vendeur: nomVendeur,
      cin_vendeur: cinVendeur
    };
  
    this.pdfService.generateContract(contractData).subscribe(
      (pdfBlob: Blob) => {
        // Créer un lien pour télécharger le PDF
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

  loadProperty(id: number): void {
    this.isLoading = true;
    this.immobilierService.getById(id).subscribe({
      next: (data) => {
        this.property = {
          ...data,
          photoPath: this.normalizePhotoPath(data.photoPath)
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du bien';
        this.isLoading = false;
      }
    });
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
}