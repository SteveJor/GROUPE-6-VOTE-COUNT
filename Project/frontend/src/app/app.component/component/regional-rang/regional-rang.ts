import {
  Component,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, query, stagger, style, animate } from '@angular/animations';

@Component({
  selector: 'app-regional-rang',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './regional-rang.html',
  styleUrls: ['./regional-rang.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class RegionalRang implements AfterViewInit, OnDestroy {

  // Données des régions avec des partis réels
  allRegionsData = [
    { id: 1, name: 'LITTORAL', totalVoters: 1200000 },
    { id: 2, name: 'CENTRE', totalVoters: 1500000 },
    { id: 3, name: 'EST', totalVoters: 850000 },
    { id: 4, name: 'SUD', totalVoters: 450000 },
    { id: 5, name: 'SUD-OUEST', totalVoters: 650000 },
    { id: 6, name: 'NORD', totalVoters: 950000 },
    { id: 7, name: 'EXTREME-NORD', totalVoters: 1100000 },
    { id: 8, name: 'ADAMAOUA', totalVoters: 500000 },
    { id: 9, name: 'OUEST', totalVoters: 900000 },
    { id: 10, name: 'NORD-OUEST', totalVoters: 800000 }
  ];

  // Partis politiques du Cameroun
  private politicalParties = [
    { id: 1, name: 'Paul Biya', party: 'RDPC', color: 'blue' },
    { id: 2, name: 'Maurice Kamto', party: 'MRC', color: 'red' },
    { id: 3, name: 'Cabral Libii', party: 'PCRN', color: 'green' },
    { id: 4, name: 'Joshua Osih', party: 'SDF', color: 'yellow' },
    { id: 5, name: 'Adamou Ndam Njoya', party: 'UDC', color: 'orange' },
    { id: 6, name: 'Garga Haman', party: 'ADD', color: 'purple' },
    { id: 7, name: 'Akere Muna', party: 'Now!', color: 'teal' }
  ];

  displayedRegions: any[] = [];
  regionsToShow = 3;
  hasMoreRegions = false;

  // Pagination des candidats par région
  candidatePaginationState: { [regionId: number]: number } = {};
  CANDIDATES_PER_PAGE = 5;
  CANDIDATES_LOAD_BLOCK = 2;

  // Simulation temps réel
  private randomTimer?: any;
  private baseVotePatterns: { [regionId: number]: { [partyId: number]: number } } = {};
  private colors = ['red', 'green', 'blue', 'olive', 'black', 'brown', 'purple'];

  // Variables pour le calcul dynamique
  private regionDataWithCandidates: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  async ngAfterViewInit(): Promise<void> {
    this.initializeRegionsWithCandidates();
    this.initializePagination();
    this.updateDisplayedRegions();

    // Démarrer la simulation temps réel
    this.startRandomVoteUpdates();
  }

  private initializeRegionsWithCandidates(): void {
    // Initialiser les patterns de vote de base pour chaque région
    this.regionDataWithCandidates = this.allRegionsData.map(region => {
      // Déterminer un pattern de vote spécifique pour chaque région
      const basePercentages = this.generateBasePercentages(region.id);

      // Calculer les votes réels basés sur le total d'électeurs
      const totalVotes = region.totalVoters * 0.65; // 65% de participation

      const candidates = this.politicalParties.map((party, index) => {
        const basePercent = basePercentages[index] || 10;
        const actualVotes = Math.round((basePercent / 100) * totalVotes);

        return {
          id: party.id,
          name: party.name,
          party: party.party,
          votesPercent: basePercent,
          actualVotes: actualVotes,
          color: party.color,
          rank: ''
        };
      });

      // Stocker le pattern de base pour les mises à jour
      this.baseVotePatterns[region.id] = {};
      this.politicalParties.forEach((party, index) => {
        this.baseVotePatterns[region.id][party.id] = basePercentages[index];
      });

      return {
        ...region,
        candidates: [...candidates],
        totalVotes: totalVotes
      };
    });

    this.recalculateRankings();
  }

  private generateBasePercentages(regionId: number): number[] {
    // Générer des pourcentages de base différents pour chaque région
    const patterns: { [key: number]: number[] } = {
      1: [45, 25, 10, 8, 5, 4, 3], // LITTORAL
      2: [60, 15, 8, 6, 5, 3, 3],  // CENTRE
      3: [40, 30, 12, 7, 5, 4, 2], // EST
      4: [35, 35, 10, 8, 6, 4, 2], // SUD
      5: [30, 40, 12, 7, 6, 3, 2], // SUD-OUEST
      6: [50, 20, 10, 8, 5, 4, 3], // NORD
      7: [55, 18, 9, 7, 5, 4, 2],  // EXTREME-NORD
      8: [42, 28, 11, 8, 5, 4, 2], // ADAMAOUA
      9: [38, 32, 12, 7, 5, 4, 2], // OUEST
      10: [33, 35, 13, 8, 5, 4, 2] // NORD-OUEST
    };

    return patterns[regionId] || [40, 25, 15, 10, 5, 3, 2];
  }

  private recalculateRankings(): void {
    this.regionDataWithCandidates.forEach(region => {
      // Trier les candidats par pourcentage de votes
      region.candidates.sort((a: any, b: any) => b.votesPercent - a.votesPercent);

      // Mettre à jour les rangs
      region.candidates.forEach((candidate: any, index: number) => {
        candidate.rank = `${index + 1}${this.getOrdinalSuffix(index + 1)}`;
      });

      // Recalculer le total des votes
      const totalActualVotes = region.candidates.reduce((sum: number, c: any) => sum + (c.actualVotes || 0), 0);
      region.totalVotes = totalActualVotes;
    });
  }

  private startRandomVoteUpdates(): void {
    const updateVotes = () => {
      this.randomizeRegionVotes();
      this.recalculateRankings();
      this.updateDisplayedRegions();
      this.cdr.markForCheck();

      // Relancer avec délai aléatoire
      this.randomTimer = setTimeout(() => updateVotes(), this.getRandomDelay());
    };

    // Premier démarrage
    this.randomTimer = setTimeout(() => updateVotes(), 2000);
  }

  private randomizeRegionVotes(): void {
    this.regionDataWithCandidates = this.regionDataWithCandidates.map(region => {
      // Créer une copie des candidats avec votes modifiés
      const updatedCandidates = region.candidates.map((candidate: any) => {
        const basePercent = this.baseVotePatterns[region.id][candidate.id] || candidate.votesPercent;

        // Variation aléatoire (entre -3% et +5%)
        const variation = this.getRandomInt(-30, 50) / 10; // En dixièmes de pourcent
        const newPercent = Math.max(1, Math.min(99, basePercent + variation));

        // Calculer les nouveaux votes réels
        const newActualVotes = Math.round((newPercent / 100) * region.totalVotes);

        return {
          ...candidate,
          votesPercent: parseFloat(newPercent.toFixed(1)),
          actualVotes: newActualVotes
        };
      });

      // Normaliser les pourcentages pour qu'ils totalisent 100%
      const totalPercent = updatedCandidates.reduce((sum: number, c: any) => sum + c.votesPercent, 0);
      const normalizedCandidates = updatedCandidates.map((candidate: any) => ({
        ...candidate,
        votesPercent: parseFloat(((candidate.votesPercent / totalPercent) * 100).toFixed(1))
      }));

      return {
        ...region,
        candidates: normalizedCandidates
      };
    });
  }

  initializePagination(): void {
    this.allRegionsData.forEach(region => {
      this.candidatePaginationState[region.id] = this.CANDIDATES_PER_PAGE;
    });
  }

  updateDisplayedRegions(): void {
    this.displayedRegions = this.regionDataWithCandidates.slice(0, this.regionsToShow);
    this.hasMoreRegions = this.regionDataWithCandidates.length > this.regionsToShow;
  }

  showMoreRegions(): void {
    this.regionsToShow += 3;
    this.updateDisplayedRegions();
  }

  getCandidatesToShow(region: any): any[] {
    const limit = this.candidatePaginationState[region.id];
    return region.candidates.slice(0, limit);
  }

  showMoreCandidates(regionId: number): void {
    this.candidatePaginationState[regionId] += this.CANDIDATES_LOAD_BLOCK;
  }

  hasMoreCandidates(region: any): boolean {
    const limit = this.candidatePaginationState[region.id];
    return region.candidates.length > limit;
  }

  // Fonctions utilitaires
  private getOrdinalSuffix(i: number): string {
    if (i === 1) return 'er';
    return 'ème';
  }

  private getRandomDelay(): number {
    return this.getRandomInt(3000, 6000); // 3 à 6 secondes
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  trackByRegionId(index: number, region: any): any {
    return region.id;
  }

  trackByCandidateId(index: number, candidate: any): any {
    return candidate.id;
  }

  ngOnDestroy(): void {
    if (this.randomTimer) {
      clearTimeout(this.randomTimer);
    }
  }
}
