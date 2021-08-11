import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AfterMove } from 'src/app/models/backgammon/after-move.model';
import { BeginnerData } from 'src/app/models/backgammon/beginner-data.model';
import { BoardState } from 'src/app/models/backgammon/board-state.model';
import { Dice } from 'src/app/models/backgammon/dice.model';
import { GameInit } from 'src/app/models/backgammon/game-init.model';
import { MoveOption } from 'src/app/models/backgammon/move-option.model';
import { PieceColor } from 'src/app/models/backgammon/piece-color.model';
import { PieceMovement } from 'src/app/models/backgammon/piece-movement.model';
import { Message } from 'src/app/models/message.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  userConnected: EventEmitter<string[]> = new EventEmitter();
  userDisonnected: EventEmitter<string[]> = new EventEmitter();
  messageRecived: EventEmitter<Message> = new EventEmitter();
  backgammonInviteRequest: EventEmitter<string> = new EventEmitter();
  backgammonInviteRejected: EventEmitter<string> = new EventEmitter();
  backgammonInviteAccepted: EventEmitter<GameInit> = new EventEmitter();
  diceRolled: EventEmitter<Dice[]> = new EventEmitter();
  beginnerDecided: EventEmitter<BeginnerData> = new EventEmitter();
  turnStarted: EventEmitter<any> = new EventEmitter();
  moveOptions: EventEmitter<MoveOption[]> = new EventEmitter();
  pieceMoved: EventEmitter<AfterMove> = new EventEmitter();

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

  emitRollDice(toUsername: string, isFirstRoll: boolean, board: BoardState = null, color: PieceColor = null) {
    this.socket.emit('roll-dice', {
      to: toUsername,
      firstRoll: isFirstRoll,
      board: board,
      color: color
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

  emitPieceClick(board: BoardState, rolls: Dice[], color: PieceColor, location: number) {
    this.socket.emit('piece-clicked', {
      board: board,
      rolls: rolls,
      color: color,
      location: location
    });
  }

  emitMovePiece(toUsername: string, board: BoardState, pieceMovement: PieceMovement) {
    this.socket.emit('move-piece', {
      to: toUsername,
      board: board,
      movement: pieceMovement
    });
  }

  //#endregion

  //#endregion


  //#region Socket Listeners
  private initUserListeners() {
    this.socket.on("user-connected", (users) => this.userConnected.emit(users));
    this.socket.on("user-disconnected", (users) => this.userDisonnected.emit(users));
  }

  private initChatListeners() {
    this.socket.on('message-recived', (message) => this.messageRecived.emit(message));
  }

  private initBackgammonListeners() {
    this.socket.on('backgammon-invite-request', (fromUsername) => this.backgammonInviteRequest.emit(fromUsername));
    this.socket.on('backgammon-invite-rejected', (fromUsername) => this.backgammonInviteRejected.emit(fromUsername));
    this.socket.on('backgammon-invite-accepted', (initGameData) => this.backgammonInviteAccepted.emit(initGameData));
    this.socket.on('dice-rolled', (diceData) => this.diceRolled.emit(diceData));
    this.socket.on('beginner-decided', (beginnerData) => this.beginnerDecided.emit(beginnerData));
    this.socket.on('turn-started', () => this.turnStarted.emit());
    this.socket.on('movement-options', (moveOptions) => this.moveOptions.emit(moveOptions));
    this.socket.on('piece-moved', (afterMoveData) => this.pieceMoved.emit(afterMoveData));
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
