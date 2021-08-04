import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { SocketService } from '../socket/socket.service';

const URL = 'http://localhost:3420';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedInUsers: string[] = [];
  loggedOutUsers: string[] = [];

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.initSockets();
  }

  initSockets() {
    if (!this.socketService.isConnected()) {
      this.socketService.setupSocketConnection();
    }

    this.socketService.userConnectedEvent.subscribe((users) => {
      this.handleUserConnectionActivity(users);
    });
    this.socketService.userDisonnectedEvent.subscribe((users) => {
      this.handleUserConnectionActivity(users);
    })
  }

  initUsersLists() {
    if (this.socketService.isConnected()) {
      this.socketService.emitUserListChanged();
    } else {
      this.getUsersList();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.socketService.disconnect();
  }

  private handleUserConnectionActivity(users: string[]) {
    this.loggedInUsers = users;
    this.getUsersList();
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
