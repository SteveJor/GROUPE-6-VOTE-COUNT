// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, map, of, Observable, from } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { User } from './model/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erreur lors du parsing du user stocké', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  async authenticate(numeroCNI: string, name: string): Promise<User> {
    const url = `${this.apiUrl}/login?numeroCNI=${encodeURIComponent(numeroCNI)}&name=${encodeURIComponent(name)}`;
    try {
      const user = await firstValueFrom(this.http.post<User>(url, { numeroCNI, name }));

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }

      return user;

    } catch (error: any) {
      console.error('Erreur d\'authentification:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie le mot de passe 2FA de l'utilisateur.
   * Renvoie un Observable<boolean> directement.
   */
  verifyTwoFactorPassword(user: User, code: string): Observable<boolean> {
    if (!user) {
      return of(false);
    }

    const numeroCNI = user.numeroCNI;
    const url = `${this.apiUrl}/accept_vote?numeroCNI=${encodeURIComponent(numeroCNI)}&password=${encodeURIComponent(code)}`;

    // Utilisation de from pour convertir la Promise en Observable
    return from(this.verifyPasswordAPI(numeroCNI, code));
  }

  /**
   * Méthode privée pour l'appel API de vérification
   */
  private async verifyPasswordAPI(numeroCNI: string, password: string): Promise<boolean> {
    const url = `${this.apiUrl}/accept_vote?numeroCNI=${encodeURIComponent(numeroCNI)}&password=${encodeURIComponent(password)}`;

    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; user?: User }>(url, { numeroCNI, password })
      );

      if (response.user) {
        // Mettre à jour l'utilisateur dans le localStorage et le BehaviorSubject
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        return true;
      }
      console.error('Erreur de vérification du mot de passe:',response );

      return true;

    } catch (error: any) {
      console.error('Erreur de vérification du mot de passe:', error);

      // Selon votre API, vous pourriez vouloir différencier les types d'erreurs
      if (error.status === 401) {
        // Mot de passe incorrect
        return false;
      }

      throw error; // Propager d'autres erreurs
    }
  }

  verifyVoter():boolean{
    const user= this.getCurrentUser();
    return !user?.avote;

  }

  /**
   * Version alternative si votre API renvoie directement un boolean
   */
  verifyTwoFactorPasswordSimple(user: User, code: string): Observable<boolean> {
    if (!user) {
      return of(false);
    }

    const numeroCNI = user.numeroCNI;
    const url = `${this.apiUrl}/accept_vote?numeroCNI=${encodeURIComponent(numeroCNI)}&password=${encodeURIComponent(code)}`;

    return this.http.post<boolean>(url, { numeroCNI, code }).pipe(
      map(response => {
        // Si la réponse contient un user, le mettre à jour
        if (response && typeof response === 'object' && 'user' in response) {
          const userResponse = response as any;
          if (userResponse.user) {
            localStorage.setItem('currentUser', JSON.stringify(userResponse.user));
            this.currentUserSubject.next(userResponse.user);
          }
          return userResponse.success || false;
        }

        // Sinon, retourner la réponse directement (supposée être un boolean)
        return response as boolean;
      })
    );
  }
}
