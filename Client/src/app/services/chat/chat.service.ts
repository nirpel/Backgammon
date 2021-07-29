import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket : Socket;

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  
    this.socket.on('message-recived', (data:string) => {
      console.log(data);
    });
  }

  sendMessage() {
    this.socket.emit('message-sent', 'Hello message from client!');
  }  

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
