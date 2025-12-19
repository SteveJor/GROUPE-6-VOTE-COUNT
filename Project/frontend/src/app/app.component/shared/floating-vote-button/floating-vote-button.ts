import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-vote-button',
  imports: [
    CommonModule
  ],
  templateUrl: './floating-vote-button.html',
  styleUrl: './floating-vote-button.scss',
})
export class FloatingVoteButton {
// Injecter l'AuthService (public pour l'utiliser dans le template) et le Router
  constructor(public authService: AuthService, private router: Router) {}

  startVote() {
    // Logique pour démarrer le processus de vote
    // Nous allons simuler la redirection vers la page de vote
    console.log("Démarrage du processus de vote...");
    this.router.navigate(['/vote-page']);
  }
}
