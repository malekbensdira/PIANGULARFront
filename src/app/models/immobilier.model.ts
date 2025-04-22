export enum TypeImmobilier {
  APPARTEMENT = 'Appartement',
  MAISON = 'MAISON', 
  TERRAIN = 'TERRAIN'
}

export interface Immobilier {
  id: number;
  type: TypeImmobilier;
  prix: number;
  superficie: number;
  latitude: number;
  longitude: number;
  ville: string;
  adresse?: string;
  anneeConstruction?: number;
  distanceCentre?: number;
  distanceEcoles?: number;
  etat?: string;
  nombrePieces?: number;
  etage?: number;
  photoPath?: string;
  images?: string[];
  main_photo_path?: string;
  photoUrl?: string;
  photoDisplayUrl?: string;
}

export interface ApiImmobilierResponse {
  id: number;
  type: TypeImmobilier;
  prix: number;
  superficie: number;
  latitude: number;
  longitude: number;
  ville: string;
  adresse?: string;
  anneeConstruction?: number;
  distanceCentre?: number;
  distanceEcoles?: number;
  etat?: string;
  nombrePieces?: number;
  etage?: number;
  mainPhotoPath?: string;
  photoPaths?: string[];
}