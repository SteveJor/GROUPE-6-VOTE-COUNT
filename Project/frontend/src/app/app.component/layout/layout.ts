import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { Footer } from '../shared/footer/footer';
import { FloatingVoteButton } from '../shared/floating-vote-button/floating-vote-button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    FloatingVoteButton
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
