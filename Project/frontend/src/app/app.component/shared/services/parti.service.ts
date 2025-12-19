import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interfaceParti } from './model/parti';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PartiService {
  private apiUrl = 'http://localhost:8080/api/admin/partis';

  constructor(private http: HttpClient) {}

  // Méthode propre pour récupérer les partis depuis l'API
  getAllPartis(): Promise<interfaceParti[]> {
    return firstValueFrom(this.http.get<interfaceParti[]>(this.apiUrl))
      .catch(error => {
        console.error('Erreur lors de la récupération des partis', error);
        return []; // retourne un tableau vide en cas d'erreur
      });
  }
}
