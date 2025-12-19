import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    RouterLink,
    
  ],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {

  currentYear: number = new Date().getFullYear();
  companyName: string = 'VoteCount';

  navigationLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'À Propos', path: '/about' },
    { label: 'Contactez', path: '/contact' },
    { label: 'Connexion', path: '/login' }
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', url: 'https://facebook.com/' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com/' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/' }
  ];

}
