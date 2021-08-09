import { Injectable } from '@angular/core';
import { BoardState } from 'src/app/models/backgammon/board-state';
import { PieceColor } from 'src/app/models/backgammon/piece-color';
import { SocketService } from '../socket/socket.service';
import { GameInit } from 'src/app/models/backgammon/game-init';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackgammonService {


  board: BoardState = { blacksLocations: [], whitesLocations: [] };
  opponent: string;
  playerColor: PieceColor = PieceColor.White;
  newPieceColor: PieceColor = PieceColor.White;

  constructor(
    private socketService: SocketService,
    private router: Router
  ) { }

  initGame(data: GameInit) {
    console.log(data);
    this.setUserColorAndOpponent(data);
    this.setBoardState({ blacksLocations: data.blacksLocations, whitesLocations: data.whitesLocations});
    this.router.navigate(['backgammon']);
  }

  inviteToPlay(username: string) {
    this.socketService.emitBackgammonInvite(username);
  }

  respondToInvite(accept: boolean, username: string) {
    this.socketService.emitBackgammonInviteAnswer(accept, username);
  }

  isPieceOnBoard(pieceIndex: number, color: PieceColor): boolean {
    if (pieceIndex < 15 && pieceIndex >= 0) {
      if (color === PieceColor.White) {
        return this.board.whitesLocations[pieceIndex] >= 0 && this.board.whitesLocations[pieceIndex] < 24
      } else {
        return this.board.blacksLocations[pieceIndex] >= 0 && this.board.blacksLocations[pieceIndex] < 24
      }
    }
    return false;
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
