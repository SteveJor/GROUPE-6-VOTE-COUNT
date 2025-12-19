import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
// CHEMIN CORRIGÉ
import { AuthService } from '../services/auth.service';

@Component({
 selector: 'app-navbar',
 standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    NgOptimizedImage
  ],

 templateUrl: './navbar.html',
 styleUrl: './navbar.scss',
})
export class Navbar {
 isMenuCollapsed = true;

 // L'injection fonctionnera maintenant que le chemin est correct
 constructor(public authService: AuthService) {}

 toggleMenu() {
 this.isMenuCollapsed = !this.isMenuCollapsed;
 }

 closeMenu() {
 this.isMenuCollapsed = true;
 }
}
