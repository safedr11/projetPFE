import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client'; // Import corrigé
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root',
})
export class StompService {
  private stompClient: Stomp.Client | null = null;
  private notificationsSubject = new Subject<string[]>(); // Utilisation d'un Subject pour émettre les notifications

  constructor(private authService: AuthService) {
    this.connect();
  }

  private connect(): void {
    try {
      const jwtToken = localStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT Token non trouvé');
        return;
      }
  
      // 1. Utilisation de SockJS avec URL de base
      const socket = new SockJS('http://localhost:8080/ws');
      
      this.stompClient = Stomp.over(socket);
  
      // 2. Configuration des headers avec le token
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        'X-Authorization': `Bearer ${jwtToken}` // Header alternatif
      };
  
      this.stompClient.connect(
        headers, // Envoi des headers d'authentification
        (frame?: Stomp.Frame) => {
          console.log('Connecté avec succès:', frame);
          this.subscribeToNotifications();
        },
        (error: string | Stomp.Frame) => {
          console.error('Erreur de connexion WebSocket:', error);
          this.handleConnectionError(error);
        }
      );
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      this.reconnect();
    }
  }
  
  private handleConnectionError(error: any): void {
    // Gestion spécifique des erreurs 401
    if (error.headers && error.headers['message']?.includes('Unauthorized')) {
      console.error('Erreur 401 - Token invalide ou expiré');
      this.authService.refreshToken().subscribe({
        next: () => this.connect(),
        error: (err) => console.error('Erreur lors du rafraîchissement du token:', err),
      });
    } else {
      // Tentative de reconnexion
      setTimeout(() => this.connect(), 5000);
    }
  }
  
  private reconnect(): void {
    setTimeout(() => {
      console.log('Tentative de reconnexion...');
      this.connect();
    }, 5000);
  }
  
  private subscribeToNotifications(): void {
    if (this.stompClient) {
      this.stompClient.subscribe(
        '/user/queue/notifications',
        (message: Stomp.Message) => {
          this.handleNotification(message.body);
        }
      );
    }
  }

  private handleNotification(body: string): void {
    try {
      const notifications = JSON.parse(body);
      this.notificationsSubject.next(notifications);
    } catch (e) {
      this.notificationsSubject.next([body]);
    }
  }

  public getNotifications(): Observable<string[]> {
    return this.notificationsSubject.asObservable();
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Déconnecté');
        this.stompClient = null;
      });
    }
  }
}