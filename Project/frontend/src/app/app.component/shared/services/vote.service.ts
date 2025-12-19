import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './model/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:8080/api/vote';

  public currentVoter: User | null = null;

  private hasVotedSubject = new BehaviorSubject<boolean>(false);
  public hasVoted$: Observable<boolean> = this.hasVotedSubject.asObservable();

  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.currentUser$.subscribe(user => {
      this.currentVoter = user;
      if (user) {
        // Vérifier si l'utilisateur a déjà voté
        const voted = localStorage.getItem(`voted_${user.id}`) === 'true' || user.avote;
        this.hasVotedSubject.next(voted);
      }
    });
  }

  /**
   * Enregistre le vote de l'utilisateur.
   * @param candidateId L'ID du candidat voté.
   */
  vote(candidateId: string): Observable<boolean> {
    if (!this.currentVoter || this.hasVotedSubject.value) {
      return of(false); // Déjà voté ou non connecté
    }

    // Utiliser le numéro CNI comme identifiant de vote
    const voterId = this.currentVoter.numeroCNI || this.currentVoter.id.toString();

    // Appeler l'API backend pour enregistrer le vote
    return this.http.post(
      `${this.apiUrl}/voter`,
      null, // ou un objet vide si votre API ne prend pas de body
      {
        params: {
          electeurId: this.currentVoter.id, // ou this.currentVoter.numeroCNI selon l'API
          partiId: candidateId,
          signature: this.currentVoter.signature // Utiliser la signature stockée
        }
      }
    ).pipe(
      map((response: any) => {
        console.log('Vote enregistré avec succès:', response);

        // Mettre à jour le statut local
        localStorage.setItem(`voted_${this.currentVoter?.id}`, 'true');
        localStorage.setItem(`voted_${this.currentVoter?.numeroCNI}`, 'true');

        // Mettre à jour l'utilisateur dans AuthService
        if (this.currentVoter) {
          this.currentVoter.avote = true;
          // Vous pourriez vouloir mettre à jour l'utilisateur dans le AuthService
        }

        this.hasVotedSubject.next(true);


        return true;
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement du vote:', error);

        if (error.status === 400) {
          console.error('Requête invalide:', error.error);
        } else if (error.status === 403) {
          console.error('Accès interdit - peut-être que l\'utilisateur a déjà voté');
        } else if (error.status === 404) {
          console.error('Électeur ou parti non trouvé');
        }

        return of(false);
      })
    );
  }

  /**
   * Version alternative si vous avez besoin de passer les paramètres dans le body
   */
  voteWithBody(candidateId: string): Observable<boolean> {
    if (!this.currentVoter || this.hasVotedSubject.value) {
      return of(false);
    }

    const voteData = {
      electeurId: this.currentVoter.id, // ou this.currentVoter.numeroCNI
      partiId: candidateId,
      signature: this.currentVoter.signature
    };

    return this.http.post<{ success: boolean; message?: string }>(
      `${this.apiUrl}/voter`,
      voteData
    ).pipe(
      map(response => {
        if (response.success) {
          localStorage.setItem(`voted_${this.currentVoter?.id}`, 'true');
          localStorage.setItem(`voted_${this.currentVoter?.numeroCNI}`, 'true');

          if (this.currentVoter) {
            this.currentVoter.avote = true;
          }

          this.hasVotedSubject.next(true);
          return true;
        }
        console.error('Vote échoué:', response.message);
        return false;
      }),
      catchError((error) => {
        console.error('Erreur API vote:', error);
        return of(false);
      })
    );
  }

  /**
   * Vérifie si l'utilisateur a déjà voté
   */
  checkVoteStatus(): Observable<boolean> {
    if (!this.currentVoter) {
      return of(false);
    }

    // Vérifier localement
    const localVote = localStorage.getItem(`voted_${this.currentVoter.id}`) === 'true' ||
      localStorage.getItem(`voted_${this.currentVoter.numeroCNI}`) === 'true';

    // Vous pouvez aussi appeler l'API pour vérifier
    return this.http.get<{ hasVoted: boolean }>(
      `${this.apiUrl}/check-vote/${this.currentVoter.id}` // Adaptez l'URL
    ).pipe(
      map(response => {
        const hasVoted = response.hasVoted || localVote;
        this.hasVotedSubject.next(hasVoted);
        return hasVoted;
      }),
      catchError(() => {
        this.hasVotedSubject.next(localVote);
        return of(localVote);
      })
    );
  }

  /**
   * Récupère les résultats des votes
   */
  getResultats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resultats`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des résultats:', error);
        return of([]);
      })
    );
  }

  /**
   * Récupère la répartition par région
   */
  getRepartitionParRegion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/repartition-region`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de la répartition:', error);
        return of([]);
      })
    );
  }

  /**
   * Récupère le classement général
   */
  getClassementGeneral(): Observable<any> {
    return this.http.get(`${this.apiUrl}/classement-general`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du classement:', error);
        return of([]);
      })
    );
  }

  /**
   * Réinitialise l'état local du service
   */
  reset(): void {
    this.currentVoter = null;
    this.hasVotedSubject.next(false);
  }

  /**
   * Met à jour le statut de vote local
   */
  setHasVoted(hasVoted: boolean): void {
    this.hasVotedSubject.next(hasVoted);
  }
}
