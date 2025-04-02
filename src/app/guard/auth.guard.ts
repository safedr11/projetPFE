import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService); // Injecter le service
  const router = inject(Router); // Injecter le Router

  return authStateService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']); // Rediriger vers la page de connexion
        return false;
      }
      return true;
    })
  );
};