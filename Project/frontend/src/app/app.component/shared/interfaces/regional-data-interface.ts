import { interfaceCandidat } from "./interfaceCandidat";

export interface RegionData {
  id: number;
  name: string; // Ex: 'LITTORAL', 'CENTRE'
  totalVoters: number; // Ex: 10 000 VOTANTS
  candidates: interfaceCandidat[]; // Liste des candidats dans cette région
}