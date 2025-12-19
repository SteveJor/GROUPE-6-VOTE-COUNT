export interface User {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  region: string;
  numeroCNI: string;
  // Numéro de vote (peut être différent du numeroCNI selon l'API)
  voteNumber?: string;
  photo: string;
  dateInscription: string;
  signature: string; // ← AJOUTÉ (présent dans localStorage)
  email: string;
  password: string; // ← AJOUTÉ (présent dans localStorage)
  avote: boolean;

  // Champs front (logique existante)
  isTwoFactorSetup?: boolean;
}
