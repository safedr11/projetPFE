import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Add 'of'
import { catchError, retry, tap } from 'rxjs/operators'; // Add 'retry' and 'tap'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { DemandeModel } from '../models/demande-model';
import { DemandeAttributeStatsDTO } from '../demande-attribute-stats-dto'; // Correct path

@Injectable({
  providedIn: 'root',
})
export class DemandesService {
  private apiUrl = 'http://localhost:8080/demandes';
  private statsCache: DemandeAttributeStatsDTO | null = null; // Define statsCache
  private cacheTimestamp: number | null = null; // Define cacheTimestamp
  private cacheDuration = 5 * 60 * 1000; // Define cacheDuration (5 minutes)

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  createDemande(demande: DemandeModel): Observable<DemandeModel> {
    return this.http.post<DemandeModel>(this.apiUrl, demande);
  }

  /*getDemandes(): Observable<DemandeModel[]> {
    if (
      this.authService.isAdmin() ||
      this.authService.isChange_Manger() ||
      this.authService.isRSSI() ||
      this.authService.isDBU() ||
      this.authService.isDSI()
    ) {
      return this.http.get<DemandeModel[]>(`${this.apiUrl}/All`);
    } else {
      return this.http.get<DemandeModel[]>(`${this.apiUrl}/mes-demandes`);
    }
  }*/
  getMesDemande(): Observable<DemandeModel[]> {
    return this.http.get<DemandeModel[]>(`${this.apiUrl}/mes-demandes`);
  }

  getAllDemandes(): Observable<DemandeModel[]> {
    return this.http.get<DemandeModel[]>(`${this.apiUrl}/All`);
  }


  submitDemande(demande: DemandeModel): Observable<DemandeModel> {
    return this.http.post<DemandeModel>(`${this.apiUrl}/submit`, demande);
  }

  getDemandeById(id: string): Observable<DemandeModel> {
    return this.http.get<DemandeModel>(`${this.apiUrl}/affich/${id}`);
  }

  validerDemande(id: string, demande: DemandeModel, approuve: boolean): Observable<{ message: string }> {
    if (this.authService.isChange_Manger()) {
        return this.http.put<{ message: string }>(`${this.apiUrl}/validerChangeManager/${id}?approuve=${approuve}`, demande);
    }
    if (this.authService.isRSSI()) {
        return this.http.put<{ message: string }>(`${this.apiUrl}/validerRSSI/${id}?approuve=${approuve}`, demande);
    }
    if (this.authService.isDBU()) {
        return this.http.put<{ message: string }>(`${this.apiUrl}/validerDBU/${id}?approuve=${approuve}`, demande);
    }
    if (this.authService.isDSI()) {
        return this.http.put<{ message: string }>(`${this.apiUrl}/validerDSI/${id}?approuve=${approuve}`, demande);
    }
    
    // Cas par défaut si aucun rôle ne correspond
    return throwError(() => new Error('Aucun rôle valide pour effectuer cette validation'));
}

  fetchStats(forceRefresh: boolean = false): Observable<DemandeAttributeStatsDTO> {
    if (!forceRefresh && this.statsCache && this.cacheTimestamp) {
      const now = Date.now();
      if (now - this.cacheTimestamp < this.cacheDuration) {
        return of(this.statsCache);
      }
    }
  
    let statsUrl = `${this.apiUrl}/stats`; // valeur par défaut
  
    if (
      this.authService.isAdmin() ||
      this.authService.isChange_Manger() ||
      this.authService.isRSSI() ||
      this.authService.isDBU() ||
      this.authService.isDSI()
    ) {
      statsUrl = `${this.apiUrl}/stats/all`;
    } else {
      statsUrl = `${this.apiUrl}/stats`;
    }
  
    return this.http.get<DemandeAttributeStatsDTO>(statsUrl).pipe(
      retry(2),
      tap((data: DemandeAttributeStatsDTO) => {
        this.statsCache = data;
        this.cacheTimestamp = Date.now();
      }),
      catchError((err) => {
        this.snackBar.open('Échec du chargement des statistiques', 'Fermer', { duration: 5000 });
        return throwError(() => err);
      })
    );
  }
  clearStatsCache(): void {
    this.statsCache = null;
    this.cacheTimestamp = null;
  }



  getValidationHistory(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/validations/${id}`);
  }


  updateDemande(id: string, demande: DemandeModel): Observable<DemandeModel> {
    return this.http.put<DemandeModel>(`${this.apiUrl}/update/${id}`, demande);
  }
  
}