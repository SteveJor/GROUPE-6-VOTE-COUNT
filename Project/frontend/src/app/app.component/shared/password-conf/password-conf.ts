import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {User} from '../services/model/user';

@Component({
  selector: 'app-password-setup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-conf.html',
  styleUrls: ['./password-conf.scss']
})
export class passwordConf {

  // L'utilisateur vérifié est passé par le LoginComponent
  @Input() user!: User;

  // Événement émis lors de la fin de la configuration (true = succès, false = échec/annulé)
  @Output() setupComplete = new EventEmitter<boolean>();

  newPassword = '';
  confirmPassword = '';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService) {}

  setupPassword() {
    this.errorMessage = null;

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir les deux champs de mot de passe.';
      return;
    }

    if (this.newPassword.length < 6) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
        return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;

    // Appel à l'AuthService pour enregistrer le nouveau mot de passe
    // (Dans une vraie application, le backend HASH le mot de passe avant de le stocker)
    // this.authService.completeTwoFactorSetup(this.user, this.newPassword).subscribe({
    //   next: (success) => {
    //     this.isLoading = false;
    //     if (success) {
    //       // Émettre l'événement de succès
    //       this.setupComplete.emit(true);
    //     } else {
    //       this.errorMessage = 'Échec de l\'enregistrement du mot de passe.';
    //     }
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.errorMessage = 'Erreur lors de la communication avec le serveur.';
    //     console.error(err);
    //   }
    // });
  }

  // Fermer le popup sans enregistrer
  cancel() {
    this.setupComplete.emit(false);
  }
}
