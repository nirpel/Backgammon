import { Injectable } from '@angular/core';
import { BoardState } from 'src/app/models/backgammon/board-state';
import { PieceColor } from 'src/app/models/backgammon/piece-color';

@Injectable({
  providedIn: 'root'
})
export class BackgammonService {


  board: BoardState = { blacksLocations: [], whitesLocations: [] };
  color: PieceColor = PieceColor.White;
  newPieceColor: PieceColor = PieceColor.White;

  constructor() { }

  newGameTest(): void {
    this.board = {
      blacksLocations: [5, 5, 5, 5, 5, 7, 7, 7, 12, 12, 12, 12, 12, 23, 23],
      whitesLocations: [18, 18, 18, 18, 18, 16, 16, 16, 11, 11, 11, 11, 11, 0, 0]
    }
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
}
