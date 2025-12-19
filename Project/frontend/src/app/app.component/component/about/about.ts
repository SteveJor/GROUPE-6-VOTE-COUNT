import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [
    CommonModule,
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  // Données utilisées dans le template
  tagline: string = "VoteCount : Votre Voix, Sécurisée et Comptée.";
  
  description: string = "VoteCount est l'application de pointe conçue pour transformer la manière dont nous gérons et participons aux élections. Notre plateforme s'engage à garantir une transparence absolue, une sécurité infaillible et une accessibilité universelle pour chaque scrutin. Avec VoteCount, le processus électoral est simplifié, modernisé et entièrement vérifiable par tous les citoyens.";
  
  pointsForts: string[] = [
    "Comptage des votes en Temps Réel.",
    "Sécurité Renforcée (Cryptographie & Auditabilité).",
    "Transparence Inégalée grâce à la traçabilité.",
    "Interface Électeur/Administrateur intuitive."
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
