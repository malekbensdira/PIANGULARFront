import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8081/ws');

    this.socket.onopen = () => {
      console.log('WebSocket connecté');
    };

    this.socket.onmessage = (event) => {
      console.log('Message reçu du serveur :', event.data);
      // Tu peux afficher ici dans l'interface plus tard si tu veux
    };

    this.socket.onclose = () => {
      console.log('WebSocket fermé');
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket :', error);
    };
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket non connecté.");
    }
  }
}
