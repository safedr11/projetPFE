
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            localStorage.setItem('token', response.access_token);
            const decodedToken = this.decodeToken(response.access_token);
            localStorage.setItem('userRole', decodedToken.role);
            console.log("Token stocké :", response.access_token);
            console.log("le role :", decodedToken.role);
          } else {
            console.error("Aucun token reçu !");
          }
        }),
        catchError(error => {
          console.error("Erreur lors de la connexion :", error);
          return throwError(() => new Error(error));
        })
      );
  }
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      return null;
    }
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.removeItem('token'); // Supprimer le token JWT
          this.deleteCookie('refreshToken'); 
          localStorage.removeItem('userRole');// Supprimer le cookie refreshToken (si possible)
          console.log("Déconnexion réussie");
        }),
        catchError(error => {
          console.error('Erreur lors de la déconnexion :', error);
          return throwError(() => new Error(error));
        })
      );
  }

  refreshToken(): Observable<any> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh-token`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            const decodedToken = this.decodeToken(response.accessToken);
            localStorage.setItem('userRole', decodedToken.role);
            console.log("Token rafraîchi :", response.accessToken);
          } else {
            console.error("Aucun token reçu après rafraîchissement !");
          }
        }),
        catchError(error => {
          console.error("Erreur lors du rafraîchissement du token :", error);
          localStorage.removeItem('token'); // Supprime le token si le refresh échoue
          localStorage.removeItem('userRole');
          return throwError(() => new Error(error));
        })
      );
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }


  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }
  
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/reset-password`,
      { token, newPassword },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  isAdmin(): boolean {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decodedToken = this.decodeToken(token);
        if (!decodedToken) return false;

        // Vérification multi-format des rôles
        const roles = [
            decodedToken.role,
            decodedToken.roles,
            ...(decodedToken.authorities || []),
            ...(decodedToken.scope?.split(' ') || [])
        ].filter(r => !!r); // Filtre les valeurs null/undefined

        return roles.some(role => 
            typeof role === 'string' && 
            role.toUpperCase().includes('ADMIN')
        );
    } catch (error) {
        console.error("Erreur lors de la vérification du rôle admin:", error);
        return false;
    }
    
    

}

isDSI(): boolean {
  try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return false;

      // Vérification multi-format des rôles
      const roles = [
          decodedToken.role,
          decodedToken.roles,
          ...(decodedToken.authorities || []),
          ...(decodedToken.scope?.split(' ') || [])
      ].filter(r => !!r); // Filtre les valeurs null/undefined

      return roles.some(role => 
          typeof role === 'string' && 
          role.toUpperCase().includes('DSI')
      );
  } catch (error) {
      console.error("Erreur lors de la vérification du rôle DSI:", error);
      return false;
  } 
  
}
isDBU(): boolean {
  try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return false;

      // Vérification multi-format des rôles
      const roles = [
          decodedToken.role,
          decodedToken.roles,
          ...(decodedToken.authorities || []),
          ...(decodedToken.scope?.split(' ') || [])
      ].filter(r => !!r); // Filtre les valeurs null/undefined

      return roles.some(role => 
          typeof role === 'string' && 
          role.toUpperCase().includes('DBU')
      );
  } catch (error) {
      console.error("Erreur lors de la vérification du rôle DBU:", error);
      return false;
  }
}
isRSSI(): boolean {
  try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return false;

      // Vérification multi-format des rôles
      const roles = [
          decodedToken.role,
          decodedToken.roles,
          ...(decodedToken.authorities || []),
          ...(decodedToken.scope?.split(' ') || [])
      ].filter(r => !!r); // Filtre les valeurs null/undefined

      return roles.some(role => 
          typeof role === 'string' && 
          role.toUpperCase().includes('RSSI')
      );
  } catch (error) {
      console.error("Erreur lors de la vérification du rôle RSSI:", error);
      return false;
  }
}

isChange_Manger(): boolean {
  try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return false;

      // Vérification multi-format des rôles
      const roles = [
          decodedToken.role,
          decodedToken.roles,
          ...(decodedToken.authorities || []),
          ...(decodedToken.scope?.split(' ') || [])
      ].filter(r => !!r); // Filtre les valeurs null/undefined

      return roles.some(role => 
          typeof role === 'string' && 
          role.toUpperCase().includes('CHANGE_MANAGER')
      );
  } catch (error) {
      console.error("Erreur lors de la vérification du rôle changemanger:", error);
      return false;
  }}
}