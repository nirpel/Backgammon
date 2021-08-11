import { EventEmitter, Injectable } from '@angular/core';
import { BoardState } from 'src/app/models/backgammon/board-state.model';
import { PieceColor } from 'src/app/models/backgammon/piece-color.model';
import { SocketService } from '../socket/socket.service';
import { GameInit } from 'src/app/models/backgammon/game-init.model';
import { Router } from '@angular/router';
import { Dice } from 'src/app/models/backgammon/dice.model';
import { BeginnerData } from 'src/app/models/backgammon/beginner-data.model';
import { MoveOption } from 'src/app/models/backgammon/move-option.model';
import { PieceMovement } from 'src/app/models/backgammon/piece-movement.model';
import { AfterMove } from 'src/app/models/backgammon/after-move.model';

@Injectable({
  providedIn: 'root'
})
export class BackgammonService {


  board: BoardState = { blacksLocations: [], whitesLocations: [] };
  opponent: string;
  playerColor: PieceColor = PieceColor.White;
  newPieceColor: PieceColor = PieceColor.White;
  isPlayerTurn: boolean;
  isAllRollsUsed: boolean;
  isDiceRolled: boolean = false;
  isFirstRoll: boolean = true;
  rolls: Dice[] = [];
  selectedPieceLocation: number;
  currentMoveOptions: MoveOption[] = [];
  moveOptionsArrived: EventEmitter<any> = new EventEmitter();
  boardChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    private socketService: SocketService,
    private router: Router
  ) { }

  initGame(data: GameInit) {
    console.log(data);
    this.setUserColorAndOpponent(data);
    this.setBoardState({ blacksLocations: data.blacksLocations, whitesLocations: data.whitesLocations });
    this.isPlayerTurn = data.turnOf === localStorage.getItem('username');
    this.listen();
    this.router.navigate(['backgammon']);
  }

  inviteToPlay(username: string) {
    this.socketService.emitBackgammonInvite(username);
  }

  respondToInvite(accept: boolean, username: string) {
    this.socketService.emitBackgammonInviteAnswer(accept, username);
  }

  endTurn() {
    this.socketService.emitTurnEnded(this.opponent);
  }

  isPieceOnBoard(pieceIndex: number, color: PieceColor): boolean {
    if (pieceIndex < 15 && pieceIndex >= 0) {
      if (color === PieceColor.White) {
        return this.board.whitesLocations[pieceIndex] >= -1 && this.board.whitesLocations[pieceIndex] < 24
      } else {
        return this.board.blacksLocations[pieceIndex] >= -1 && this.board.blacksLocations[pieceIndex] < 24
      }
    }
    return false;
  }

  rollDice() {
    this.isDiceRolled = true;
    this.socketService.emitRollDice(this.opponent, this.isFirstRoll);
  }

  onPieceClicked(location: number, color: PieceColor) {
    if (this.playerColor === color && !this.isFirstRoll && this.isPlayerTurn) {
      this.selectedPieceLocation = location;
      this.socketService.emitPieceClick(this.board, this.rolls, color, location);
    }
  }

  movePiece(toBarIndex: number) {
    let diceValue = this.currentMoveOptions.find(opt => opt.newLocation === toBarIndex).diceValue;
    let pieceMovement: PieceMovement = {
      fromLocation: this.selectedPieceLocation,
      newLocation: toBarIndex,
      color: this.playerColor,
      diceValue: diceValue,
      rolls: this.rolls
    };
    this.onMoveOptions([]);
    this.socketService.emitMovePiece(this.opponent, this.board, pieceMovement);
  }

  private listen() {
    this.socketService.diceRolled.subscribe((rolls) => {
      this.onDiceRolled(rolls);
    });
    this.socketService.beginnerDecided.subscribe((beginnerData) => {
      this.onBeginnerDecided(beginnerData);
    });
    this.socketService.turnStarted.subscribe(() => {
      this.onTurnStarted();
    });
    this.socketService.moveOptions.subscribe((moveOptions) => {
      this.onMoveOptions(moveOptions);
    });
    this.socketService.pieceMoved.subscribe((gameData) => {
      this.onPieceMoved(gameData);
    });
  }

  private onPieceMoved(gameData: AfterMove) {
    this.rolls = gameData.rolls;
    this.board = gameData.board;
    this.checkIfRollsLeft();
    this.boardChanged.emit();
  }

  private onMoveOptions(moveOptions: MoveOption[]) {
    this.currentMoveOptions = moveOptions;
    this.moveOptionsArrived.emit();
  }

  private onTurnStarted() {
    this.rolls = [];
    this.isAllRollsUsed = false;
    this.isPlayerTurn = !this.isPlayerTurn;
    this.isDiceRolled = false;
  }

  private checkIfRollsLeft() {
    if (this.rolls.filter(dice => !dice.isUsed).length === 0) {
      this.isAllRollsUsed = true;
    }
  }

  private onBeginnerDecided(beginnerData: BeginnerData) {
    if (this.playerColor === PieceColor.Black) {
      this.isPlayerTurn = beginnerData.beginner === 0;
    } else {
      this.isPlayerTurn = beginnerData.beginner === 1;
    }
    this.isFirstRoll = !beginnerData.beginnerDecided;
    this.isDiceRolled = false;
  }

  private onDiceRolled(rolls: Dice[]) {
    if (rolls.length > 1) {
      this.rolls = rolls;
    } else {
      this.setRolledDiceAsFirstRoll(rolls);
    }
  }

  private setRolledDiceAsFirstRoll(rolls: Dice[]) {
    if (this.rolls.length > 1) {
      this.rolls = [];
    }
    this.rolls.push(rolls[0]);
    this.isPlayerTurn = !this.isPlayerTurn;
    if (this.rolls.length === 2) {
      this.socketService.emitRollToStartEnded(this.opponent, this.rolls);
    }
  }

  private setBoardState(newState: BoardState) {
    this.board = newState;
  }

  private setUserColorAndOpponent(data: GameInit) {
    if (data.black === localStorage.getItem('username')) {
      this.playerColor = PieceColor.Black;
      this.opponent = data.white;
    } else {
      this.playerColor = PieceColor.White;
      this.opponent = data.black;
    }
  }
}
