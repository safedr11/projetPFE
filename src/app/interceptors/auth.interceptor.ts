import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  // Clone la requête et ajoute le token JWT dans les en-têtes
  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Tentative de rafraîchissement du token en cas d'erreur 401
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            // Supprime l'ancien token et enregistre le nouveau
            localStorage.removeItem('token');
            localStorage.setItem('token', response.access_token);

            // Clone la requête originale avec le nouveau token
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.access_token}` }
            });

            // Relance la requête avec le nouveau token
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            // En cas d'échec du rafraîchissement, déconnecte l'utilisateur
            authService.logout();
            return throwError(() => new Error('Session expirée, veuillez vous reconnecter.'));
          })
        );
      }

      // Gestion des autres erreurs
      return throwError(() => error);
    })
  );
}