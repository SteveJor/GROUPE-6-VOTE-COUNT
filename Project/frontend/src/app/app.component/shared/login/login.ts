import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../services/model/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {

  isDetailedForm = false;

  // Champs du formulaire simple
  voteNumber = '';
  voterName = '';

  // Champs du formulaire détaillé
  voterFirstName = '';
  voterBirthDate = '';
  voterFatherName = '';
  voterMotherName = '';

  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef // Injection pour forcer la détection de changements
  ) {}


  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/vote']);
      }
    });
  }

  toggleForm(useDetailed: boolean): void {
    this.isDetailedForm = useDetailed;
    this.errorMessage = null;
    this.clearForm();
  }

  clearForm(): void {
    this.voteNumber = '';
    this.voterName = '';
    this.voterFirstName = '';
    this.voterBirthDate = '';
    this.voterFatherName = '';
    this.voterMotherName = '';
  }

  async authenticate(): Promise<void> {
    // Réinitialiser l'erreur
    this.errorMessage = null;

    // Validation simple du formulaire
    if (!this.voterName || this.voterName.trim() === '') {
      this.errorMessage = 'Le nom de famille est obligatoire.';
      return;
    }

    if (!this.isDetailedForm && (!this.voteNumber || this.voteNumber.trim() === '')) {
      this.errorMessage = 'Le numéro de vote est obligatoire.';
      return;
    }

    // Démarrer le chargement
    this.isLoading = true;
    this.cd.detectChanges(); // forcer l'affichage du spinner immédiatement

    try {
      // Appeler le service d'authentification
      const user = await this.authService.authenticate(this.voteNumber, this.voterName);

      if (user) {
        // Succès : rediriger vers la page de vote
        this.router.navigate(['/home']);
      } else {
        // Aucun utilisateur retourné
        this.errorMessage = 'Identifiants incorrects. Veuillez vérifier vos informations.';
      }

    } catch (error: any) {
      // Gestion robuste des messages d'erreur
      if (error?.error) {
        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = `Erreur inconnue (status ${error.status})`;
        }
      } else {
        this.errorMessage = `Impossible de contacter le serveur (status ${error?.status ?? 'inconnu'})`;
      }

      console.error('Erreur d\'authentification:', error);

    } finally {
      // Arrêter le chargement et mettre à jour le template
      this.isLoading = false;
      this.cd.detectChanges(); // forcer la mise à jour de l'UI
    }
  }

  private getErrorMessageByStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
      case 400:
        return 'Requête invalide. Vérifiez les informations saisies.';
      case 401:
        return 'Identifiants incorrects. Veuillez vérifier vos informations.';
      case 403:
        return 'Accès refusé.';
      case 404:
        return 'Utilisateur non trouvé.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}
