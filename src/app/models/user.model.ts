export interface User {
    id: number;
    nom: string;
    prenom: string;
    cin: number;
    email: string;
    mdp: string;
    sexe: string;
    tel: number;
    role: string;
    adresse: string;
    image: string;  // Champ pour stocker l'URL de l'image
    soldeCourant: number;
    rib: string;
    age: number;
    resetCode: string;
  }
  