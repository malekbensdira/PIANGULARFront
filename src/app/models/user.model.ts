import { Role } from './role.model'; // assure-toi que le chemin est bon

export interface User {
  id: number;
  nom: string;
  prenom: string;
  cin: number;
  email: string;
  mdp: string;
  sexe: string;
  tel: number;
  role: Role;  // <- Corrigé ici
  adresse: string;
  image: string;
  soldeCourant: number;
  rib: string;
  age: number;
  resetCode: string;
}
