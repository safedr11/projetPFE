import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatToolbarModule} from '@angular/material/toolbar';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatButtonModule } from '@angular/material/button'; // Optionnel, si vous utilisez des boutons
import { MatIconModule } from '@angular/material/icon'; 
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true, // Composant standalone
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule,HttpClientModule,MatSidenavModule,
    MatButtonModule, // Option,
    MatIconModule,RouterModule,MatToolbarModule,MatButtonModule,MatListModule,MatMenuModule],
})
export class HomeComponent {
 
  userEmail: string | null = null;
  userRole: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Simuler la récupération de l'email de l'utilisateur (à remplacer par une vraie logique)
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = localStorage.getItem('userRole');
  }
   

  menuItems: any[] = [
    {
      icon: 'person',  // Icône pour les utilisateurs
      label: 'Utilisateurs',
      route: 'utilisateurs',
      roles: ['ADMIN']
    },
    {
      icon: 'inventory', // Icône pour le catalogue
      label: 'Catalogue',
      route: 'catalogue',
      roles: ['ADMIN']
    },
    {
      icon: 'description', // Icône pour les demandes
      label: 'Demandes',
      route: 'demandes',
      roles: ['REQUESTER','ADMIN']
    },
    
  
    
  ];




  get filteredMenuItems() {
    return this.menuItems.filter(item => item.roles.includes(this.userRole));
  }

  /*viewProfile() {
    console.log('Redirection vers le profil...');
    this.router.navigate(['/profile']);
  }*/






 logout(): void {
    this.authService.logout().pipe(
      catchError((error: any) => {
        console.error('Erreur lors de la déconnexion :', error);
        this.snackBar.open('Échec de la déconnexion. Veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
        throw error;
      })
    ).subscribe({
      next: () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }
}
