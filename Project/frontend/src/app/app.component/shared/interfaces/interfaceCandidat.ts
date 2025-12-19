
export interface interfaceCandidat {
  
  id: number; 
  name: string; 
  party: string; 
  votesPercent: number; 
  color: 'red' | 'green' | 'olive' | 'blue' | 'black' | 'brown' | string; 
  rank: string; 
  imageUrl?: string; 
}