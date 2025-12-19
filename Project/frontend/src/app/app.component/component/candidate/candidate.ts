import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartiService } from '../../shared/services/parti.service';
import { interfaceParti } from '../../shared/services/model/parti';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            transform: 'scale(0.8) translateY(20px)'
          }),
          stagger(50, [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({
                opacity: 1,
                transform: 'scale(1) translateY(0)'
              })
            )
          ])
        ], { optional: true }),

        query(':leave', [
          stagger(30, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({
                opacity: 0,
                transform: 'scale(0.8) translateY(-20px)'
              })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Candidate implements AfterViewInit, OnDestroy {

  allCandidates: interfaceParti[] = [];
  displayedCandidates: interfaceParti[] = [];
  candidatesToShow = 8;
  hasMoreCandidates = false;
  isLoading = true;

  private colors: string[] = ['red', 'green', 'olive', 'blue', 'black', 'brown', 'purple'];
  private randomTimer?: any;

  constructor(
    private partiService: PartiService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.isLoading = true;

    try {
      const partis = await this.partiService.getAllPartis();

      this.allCandidates = partis.map((parti, index) => ({
        ...parti,
        color: this.colors[index % this.colors.length],
        votesPercent: parti.nombreDeVoix ?? 0,
        rank: ''
      }));

      this.recalculateRanking();
      this.updateDisplayedCandidates();

      // 🔁 démarre la simulation live
      this.startRandomRankingUpdates();

    } catch (error) {
      console.error('Erreur lors du chargement des partis', error);
      this.allCandidates = [];
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  // 🔁 boucle avec délai aléatoire (2 à 4 s pour mieux voir les transitions)
  private startRandomRankingUpdates(): void {
    const delay = this.getRandomDelay();

    this.randomTimer = setTimeout(() => {
      this.randomizeVotes();
      this.recalculateRanking();
      this.updateDisplayedCandidates();

      // rafraîchit UNIQUEMENT ce composant
      this.cdr.markForCheck();

      // relance avec un nouveau délai
      this.startRandomRankingUpdates();
    }, delay);
  }

  private randomizeVotes(): void {
    this.allCandidates = this.allCandidates.map(candidate => {
      const currentVotes = candidate.votesPercent ?? 0;

      return {
        ...candidate,
        votesPercent: Math.max(
          0,
          currentVotes + this.getRandomInt(-5, 10)
        ),
      };
    });
  }

  private recalculateRanking(): void {
    // Trier par votes
    this.allCandidates
      .sort((a, b) => (b.votesPercent ?? 0) - (a.votesPercent ?? 0))
      .forEach((candidate, index) => {
        candidate.rank = `${index + 1}${this.getOrdinalSuffix(index + 1)}`;
        // 🔄 Reassigner la couleur selon l'ordre après tri
        candidate.color = this.colors[index % this.colors.length];
      });
  }

  updateDisplayedCandidates(): void {
    this.displayedCandidates = this.allCandidates.slice(0, this.candidatesToShow);
    this.hasMoreCandidates = this.allCandidates.length > this.candidatesToShow;
  }

  showMore(): void {
    this.candidatesToShow += 3;
    this.updateDisplayedCandidates();
    this.cdr.markForCheck();
  }

  // ⭐ Fonction trackBy pour améliorer les performances et les animations
  trackByPartiId(index: number, parti: interfaceParti): any {
    return parti.id ?? parti.nomParti;
  }

  private getOrdinalSuffix(i: number): string {
    if (i === 1) return 'er';
    return 'ème';
  }

  private getRandomDelay(): number {
    return this.getRandomInt(2000, 4000); // 2 à 4 secondes
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngOnDestroy(): void {
    if (this.randomTimer) {
      clearTimeout(this.randomTimer);
    }
  }
}
