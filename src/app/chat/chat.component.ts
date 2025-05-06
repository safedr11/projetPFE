import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ChatComponent {
  messages: Array<{sender: string, content: string}> = [];
  message: string = '';
  isLoading: boolean = false;

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (this.message.trim() && !this.isLoading) {
      // Ajouter le message de l'utilisateur
      const userMessage = { 
        sender: 'User', 
        content: this.message 
      };
      this.messages.push(userMessage);
      this.isLoading = true;
      this.message = ''; // Vider le champ d'entrée

      // Envoyer au service
      this.chatService.sendMessage(userMessage).subscribe({
        next: (response: any) => {
          // Réponse du backend
          const aiResponse = {
            sender: 'IA',
            content: response.content || 'Pas de réponse'
          };
          this.messages.push(aiResponse);
          this.isLoading = false;
        },
        error: (error) => {
          // Gestion des erreurs
          const errorResponse = {
            sender: 'IA',
            content: 'Désolé, une erreur est survenue: ' + error.message
          };
          this.messages.push(errorResponse);
          this.isLoading = false;
          console.error('Erreur API:', error);
        }
      });
    }
  }
}
