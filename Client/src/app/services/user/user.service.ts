import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  socket: Socket;

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, { query: { 'token': localStorage.getItem('token') } });

    this.socket.on("connected", () => {
      console.log('someone connected');
    })

    this.socket.on("user-connected", (users) => {
      console.log(users);
    })

    this.socket.on("user-disconnected", (users) => {
      console.log(users);
    })
  }

  logout() {
    localStorage.removeItem('token');
    this.disconnect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
