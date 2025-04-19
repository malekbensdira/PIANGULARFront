// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private ws!: WebSocket;
  private messageSubject = new Subject<string>();

  connect(userId: number): void {
    this.ws = new WebSocket(`ws://localhost:8081/chat/${userId}`);

    this.ws.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  sendMessage(receiverEmail: string, message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(`${receiverEmail}:${message}`);
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}
