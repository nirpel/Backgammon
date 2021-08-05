import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Message } from 'src/app/models/message.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  userConnectedEvent: EventEmitter<string[]> = new EventEmitter();
  userDisonnectedEvent: EventEmitter<string[]> = new EventEmitter();
  messageRecivedEvent: EventEmitter<Message> = new EventEmitter();

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, { query: { 'token': localStorage.getItem('token') } });
    this.initUserListeners();
    this.initChatListeners();
  }

  //#region Socket Events

  //#region User Events
  emitUserListChanged() {
    this.socket.emit('users-list');
  }
  //#endregion

  //#region Chat Events
  emitMessageSent(message: Message, toUsername: string) {
    this.socket.emit('message-sent', {
      message: message,
      to: toUsername
    });
  }
  //#endregion

  //#endregion


  //#region Socket Listeners
  private initUserListeners() {
    this.socket.on("user-connected", (users) => this.userConnectedEvent.emit(users));
    this.socket.on("user-disconnected", (users) => this.userDisonnectedEvent.emit(users));
  }

  private initChatListeners() {
    this.socket.on('message-recived', (message) => { console.log(message); this.messageRecivedEvent.emit(message) });
  }
  //#endregion


  //#region Helpers
  isConnected(): boolean {
    if (this.socket)
      return true;
    return false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  //#endregion
}
