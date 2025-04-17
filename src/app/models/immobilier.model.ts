export enum TypeImmobilier {
    APPARTEMENT = 'APPARTEMENT',
    MAISON = 'MAISON',
    VILLA = 'VILLA',
    TERRAIN = 'TERRAIN'
  }
  
  export interface Immobilier {
    id?: number;
    type: TypeImmobilier;
    prix: number;
    superficie: number;
    latitude: number;
    longitude: number;
    ville: string;
    annee_construction: number;  // Avec underscore
    distance_centre: number;     // Avec underscore
    distance_ecoles: number;     // Avec underscore
    etat: string;
    nombre_pieces: number;       // Avec underscore
    etage: number;
    images?: string[]; // URLs des images
    photoPath?: string; // Chemin de la photo principale
  }