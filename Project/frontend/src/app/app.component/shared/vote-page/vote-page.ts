// vote-page.component.ts
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VoteService } from '../services/vote.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/model/user';
import { map, Observable } from 'rxjs';
import { PartiService } from '../services/parti.service';
import { interfaceParti } from '../services/model/parti';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vote-page.html',
  styleUrls: ['./vote-page.scss'],
  animations: [
    trigger('gridAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.9) translateY(30px)' }),
          stagger(80, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          stagger(50, [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'scale(0.9) translateY(-30px)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class VotePage implements AfterViewInit {
  selectedId: number | null = null;
  selectedCandidate: interfaceParti | null = null;
  showConfirm = false;
  candidateToVote = '';
  votePassword = '';
  errorMessage: string | null = null;
  allCandidates: interfaceParti[] = [];

  isLoading = true;
  hasVoted$: Observable<boolean>;

  private readonly SIMULATED_PASSWORD = 'Vote2025!';
  private colors: string[] = ['red','green','olive','blue','black','brown','purple'];

  constructor(
    private partiService: PartiService,
    public voteService: VoteService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.hasVoted$ = this.voteService.hasVoted$;
  }

  ngAfterViewInit(): void {
    this.isLoading = true;
    this.loadCandidates();
  }

  private async loadCandidates(): Promise<void> {
    try {
      const partis = await this.partiService.getAllPartis();
      this.allCandidates = partis.map((c, i) => ({
        ...c,
        color: this.colors[i % this.colors.length],
        description: c.slogan || `Candidat du parti ${c.nomParti}`
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des candidats', error);
      this.allCandidates = [];
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  trackByPartiId(index: number, parti: interfaceParti): any {
    return parti.id ?? parti.nomParti;
  }

  selectCandidate(candidate: interfaceParti) {
    this.selectedId = candidate.id;
    this.selectedCandidate = candidate;
    this.candidateToVote = `${candidate.president} - ${candidate.nomParti}`;
    this.errorMessage = null;
  }

  confirm(candidate: interfaceParti, event: Event) {
    event.stopPropagation();
    this.selectCandidate(candidate);
    this.votePassword = '';
    this.errorMessage = null;
    this.showConfirm = true;
  }

  cancelVote() {
    this.showConfirm = false;
    this.votePassword = '';
    this.errorMessage = null;
  }

  finalizeVote() {
    if (!this.selectedCandidate) {
      this.errorMessage = 'Veuillez sélectionner un candidat.';
      return;
    }

    if (!this.votePassword) {
      this.errorMessage = 'Veuillez entrer votre mot de passe de vote.';
      return;
    }

    const user: User | null = this.voteService.currentVoter || this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = "Erreur : utilisateur non connecté.";
      return;
    }

    if (user.avote) {
      this.errorMessage = "Vous avez déjà voté.";
      return;
    }

    if (this.votePassword !== this.SIMULATED_PASSWORD) {
      this.errorMessage = "Mot de passe incorrect.";
      this.votePassword = '';
      return;
    }

    // ✅ Vote simulé réussi
    user.avote = true;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.voteService.setHasVoted(true);

    this.errorMessage = null;
    this.showConfirm = false;
    this.votePassword = '';

    alert(`✅ Vote enregistré pour ${this.selectedCandidate.president} - ${this.selectedCandidate.nomParti}`);
  }

  showMore(candidate: interfaceParti, event: Event) {
    event.stopPropagation();
    alert(`Détails sur ${candidate.president}:\nParti: ${candidate.nomParti}\nSlogan: ${candidate.slogan}`);
  }

  logout() {
    this.voteService.reset();
    this.router.navigate(['/']);
  }
}
