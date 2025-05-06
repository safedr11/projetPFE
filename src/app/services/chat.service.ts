import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  content: string;
  sender: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat/send';

 

  constructor(private http: HttpClient) {}

  sendMessage(message: { content: string, sender: string }): Observable<any> {
    // Votre backend attend un objet avec content et sender
    return this.http.post(this.apiUrl, {
      content: message.content,
      sender: message.sender || 'User' // Valeur par défaut
    });
  }
}