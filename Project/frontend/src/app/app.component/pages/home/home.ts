import { Component } from '@angular/core';
import { MinuteComponent } from '../../component/minute/minute'; // nom exact exporté
import { Candidate } from '../../component/candidate/candidate';
import { RegionalRang } from '../../component/regional-rang/regional-rang';
import { About } from '../../component/about/about';
import { Contact } from '../../component/contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MinuteComponent,
    Candidate,
    RegionalRang,
    About,
    Contact,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {}
