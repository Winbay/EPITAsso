interface activite {
  text: string;
  heures: number | null;
}

export enum Poste {
  Membre = 'Membre',
  President = 'Président',
  VicePresident = 'Vice-Président',
  Secretaire = 'Secrétaire',
  Tresorier = 'Trésorier',
}

export interface EngagementEtudiant {
  login: string;
  nom: string;
  prenom: string;
  promotion: string;
  poste: Poste | null;
  commentaire: string;
  activites: activite[];
  totalHeures: number | null;
  totalJour: number | null;
}