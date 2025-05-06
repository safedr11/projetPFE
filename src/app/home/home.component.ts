import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { StompService } from '../services/stomp.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule
  ],
  animations: [
    trigger('shake', [
      state('inactive', style({ transform: 'translateX(0)' })),
      state('active', style({ transform: 'translateX(0)' })),
      transition('inactive => active', [
        animate('0.5s', keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-5px)', offset: 0.2 }),
          style({ transform: 'translateX(5px)', offset: 0.4 }),
          style({ transform: 'translateX(-5px)', offset: 0.6 }),
          style({ transform: 'translateX(5px)', offset: 0.8 }),
          style({ transform: 'translateX(0)', offset: 1 }),
        ]))
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  userEmail: string | null = null;
  userRole: string | null = null;
  notifications: { title: string; message: string }[] = [];
  hasNewNotifications: boolean = false;
  shakeState: string = 'inactive';
  
  private notificationSound: HTMLAudioElement;

  menuItems: any[] = [
    {
      icon: 'person',
      label: 'Utilisateurs',
      route: 'utilisateurs',
      roles: ['ADMIN']
    },
    {
      icon: 'inventory',
      label: 'Catalogue',
      route: 'catalogue',
      roles: ['ADMIN', 'DEMANDEUR', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTER']
    },
    {
      icon: 'description',
      label: 'Demandes',
      roles: ['DEMANDEUR', 'ADMIN', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTER'],
      subItems: [
        {
          label: 'Mes Demandes',
          route: 'demandes/mes-demandes',
          roles: ['DEMANDEUR', 'ADMIN', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTER']
        },
        {
          label: 'Tous les Demandes',
          route: 'demandes/toutes',
          roles: ['ADMIN', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI']
        },
    
      
      
      ]
    },
    {
      icon: 'dashboard',
      label: 'Overview',
      route: 'overview',
      roles: ['DEMANDEUR', 'ADMIN', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTER']
    },
    {
      icon: 'support_agent',
      label: 'Assistant IA',
      route: 'AssistanceIa',
      roles: ['DEMANDEUR', 'ADMIN', 'CHANGE_MANAGER', 'RSSI', 'DBU', 'DSI', 'EXECUTER']
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private stompService: StompService
  ) {
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = localStorage.getItem('userRole');
    this.notificationSound = new Audio('/assets/simple-notification-152054.mp3');
  }

  ngOnInit(): void {
    this.stompService.getNotifications().subscribe({
      next: (data: any[]) => {
        const newNotifications = data.map(notification => ({
          title: 'Notification',
          message: notification.message,
        }));
        this.notifications = [...newNotifications, ...this.notifications];
        this.hasNewNotifications = true;
        this.shakeState = 'active';
        this.playNotificationSound();
      },
      error: (err) => console.error('Erreur lors de la réception des notifications:', err),
    });
  }

  private playNotificationSound(): void {
    this.notificationSound.play().catch(error => {
      console.error('Erreur lors de la lecture du son de notification:', error);
    });
  }

  clearNewNotificationState(): void {
    this.hasNewNotifications = false;
    this.shakeState = 'inactive';
  }

  get filteredMenuItems() {
    return this.menuItems.map(item => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter((subItem: any) => subItem.roles.includes(this.userRole))
        };
      }
      return item;
    }).filter(item => item.roles.includes(this.userRole));
  }

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