import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit {

  contactForm!: FormGroup;
  isSubmitted: boolean = false;

  contactInfo = {
    address: 'LOGBESSOU, Douala, Cameroun',
    phone: '+237 6XX XX XX XX',
    email: 'contact@votecount.com'
  };

  // Injecter le FormBuilder pour construire le formulaire
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      // Définition des champs et de leurs règles de validation
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Fonction pour accéder facilement aux contrôles du formulaire dans le template
  get f() { 
    return this.contactForm.controls; 
  }

  onSubmit() {
    this.isSubmitted = true;

    // Arrête le processus si le formulaire est invalide
    if (this.contactForm.invalid) {
      console.log('Formulaire invalide.');
      return;
    }

    // SIMULATION : Envoi des données (cette partie serait remplacée par un appel de service)
    console.log('Formulaire soumis avec succès:', this.contactForm.value);

    // Réinitialiser le formulaire après l'envoi
    // this.contactForm.reset(); 
    // this.isSubmitted = false;
  }
}
