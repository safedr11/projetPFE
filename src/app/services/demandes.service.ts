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

  getDemandes(): Observable<DemandeModel[]> {
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

  fetchStats(forceRefresh: boolean = false): Observable<DemandeAttributeStatsDTO> {
    if (!forceRefresh && this.statsCache && this.cacheTimestamp) {
      const now = Date.now();
      if (now - this.cacheTimestamp < this.cacheDuration) {
        return of(this.statsCache);
      }
    }

    return this.http.get<DemandeAttributeStatsDTO>(`${this.apiUrl}/stats`).pipe(
      retry(2),
      tap((data: DemandeAttributeStatsDTO) => { // Add type for 'data'
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
}