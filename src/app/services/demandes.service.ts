import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Assurez-vous que le chemin est correct
import { DemandeModel } from '../models/demande-model';

@Injectable({
  providedIn: 'root'
})
export class DemandesService {
  private apiUrl = 'http://localhost:8080/demandes';
  constructor(private http: HttpClient,private authService: AuthService){} // Injectez le service d'authentification) { }

   /**
   * Crée une nouvelle demande
   */
   createDemande(demande: DemandeModel): Observable<DemandeModel> {
    return this.http.post<DemandeModel>(this.apiUrl, demande);
  }

  /**
   * Récupère toutes les demandes de l'utilisateur connecté
   */
  getDemandes(): Observable<DemandeModel[]> {
    if (this.authService.isAdmin()|| this.authService.isChange_Manger()|| this.authService.isRSSI() || this.authService.isDBU() || this.authService.isDSI()) {
      return this.http.get<DemandeModel[]>(`${this.apiUrl}/All`);
    } else {
      return this.http.get<DemandeModel[]>(`${this.apiUrl}/mes-demandes`);
    }
  }
  submitDemande(demande: DemandeModel): Observable<DemandeModel> {
    return this.http.post<DemandeModel>(`${this.apiUrl}/submit`, demande);
  }
  getDemandeById(id: string): Observable<DemandeModel> {
    return this.http.get<DemandeModel>(`${this.apiUrl}/affich/${id}`);
  }
 
  
  validerDemande(id: string, demande: DemandeModel, approuve: boolean): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/valider/${id}?approuve=${approuve}`, demande);
  }
  
}
