import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { GameInit } from 'src/app/models/backgammon/game-init';
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
  backgammonInviteRequest: EventEmitter<string> = new EventEmitter();
  backgammonInviteRejected: EventEmitter<string> = new EventEmitter();
  backgammonInviteAccepted: EventEmitter<GameInit> = new EventEmitter();

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, { query: { 'token': localStorage.getItem('token') } });
    this.initUserListeners();
    this.initChatListeners();
    this.initBackgammonListeners();
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

  //#region Backgammon Events
  emitBackgammonInvite(toUsername: string) {
    this.socket.emit('backgammon-invite', {
      to: toUsername,
      from: localStorage.getItem('username')
    });
  }

  emitBackgammonInviteAnswer(isAccepted: boolean, toUsername: string) {
    this.socket.emit('backgammon-invite-answer', {
      to: toUsername,
      from: localStorage.getItem('username'),
      isAccepted: isAccepted
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
    this.socket.on('message-recived', (message) => this.messageRecivedEvent.emit(message));
  }

  private initBackgammonListeners() {
    this.socket.on('backgammon-invite-request', (fromUsername) => this.backgammonInviteRequest.emit(fromUsername));
    this.socket.on('backgammon-invite-rejected', (fromUsername) => this.backgammonInviteRejected.emit(fromUsername));
    this.socket.on('backgammon-invite-accepted', (initGameData) => this.backgammonInviteAccepted.emit(initGameData));
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
