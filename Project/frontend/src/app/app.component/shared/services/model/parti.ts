// src/app/shared/interfaces/interfaceParti.ts
export interface interfaceParti {
  id: number;
  nomParti: string;
  president: string;
  nombreDeVoix: number;
  slogan: string;
  version: number;
  color?: string; // couleur assignée dynamiquement côté frontend
  rank?: string;  // classement si besoin
  votesPercent?: number; // pour le graphique
}
