import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';

const URL = 'http://localhost:3420';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  socket: Socket;
  loggedInUsers: string[] = [];
  loggedOutUsers: string[] = [];

  constructor(private http: HttpClient) { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, { query: { 'token': localStorage.getItem('token') } });

    this.socket.on("connected", () => {
      console.log('someone connected');
    })

    this.socket.on("user-connected", (users) => {
      this.loggedInUsers = users;
      this.getUsersList();
    })

    this.socket.on("user-disconnected", (users) => {
      this.loggedInUsers = users;
      this.getUsersList();
    })
  }

  initUsersLists() {
    if (this.socket) {
      this.socket.emit('users-list');
    } else {
      this.getUsersList();
    }
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

  private getUsersList() {
    let users: string[];
    return this.http.get<string[]>(URL + '/api/users').subscribe(
      (data) => {
        users = data;
      }, (err) => {
        console.log(err);
      }, () => {
        this.loggedOutUsers = users.filter((user) => !this.loggedInUsers.includes(user));
      }
    )
  }
}
