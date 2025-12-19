// src/app/shared/interfaces/region-data.interface.t

export interface RegionCandidate {
  id: number;
  name: string;
  party: string;
  votesPercent: number;
  color: string;
  rank: string;
  actualVotes?: number; // Nombre réel de votes (calculé à partir du pourcentage)
}

export interface RegionData {
  id: number;
  name: string;
  totalVoters: number;
  candidates: RegionCandidate[];
  totalVotes?: number; // Total des votes actuels
}
