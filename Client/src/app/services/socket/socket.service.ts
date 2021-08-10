import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BeginnerData } from 'src/app/models/backgammon/beginner-data';
import { Dice } from 'src/app/models/backgammon/dice';
import { GameInit } from 'src/app/models/backgammon/game-init';
import { PieceColor } from 'src/app/models/backgammon/piece-color';
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
  diceRolled: EventEmitter<Dice[]> = new EventEmitter();
  beginnerDecided: EventEmitter<BeginnerData> = new EventEmitter();
  turnStarted: EventEmitter<any> = new EventEmitter();

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

  emitRollDice(toUsername: string, isFirstRoll: boolean) {
    this.socket.emit('roll-dice', {
      to: toUsername,
      firstRoll: isFirstRoll
    });
  }

  emitRollToStartEnded(toUsername: string, rolls: Dice[]) {
    this.socket.emit('roll-to-start-ended', {
      to: toUsername,
      rolls: rolls
    });
  }

  emitTurnEnded(toUsername: string) {
    this.socket.emit('turn-ended', { to: toUsername });
  }

  emitPieceClick() {
    this.socket.emit('piece-clicked', {
      todo: 'add data'
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
    this.socket.on('dice-rolled', (diceData) => this.diceRolled.emit(diceData));
    this.socket.on('beginner-decided', (beginnerData) => this.beginnerDecided.emit(beginnerData));
    this.socket.on('turn-started', () => this.turnStarted.emit());
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
