import { Component, Input, OnInit } from '@angular/core';
import { PieceColor } from 'src/app/models/backgammon/piece-color.model';
import { BackgammonService } from 'src/app/services/backgammon/backgammon.service';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {

  white: PieceColor = PieceColor.White;
  black: PieceColor = PieceColor.Black;
  color: PieceColor = this.gameService.newPieceColor;
  location: number;
  isFlat = false;

  constructor(private gameService: BackgammonService) { }

  ngOnInit(): void {
  }

  onClick() {
    if (!this.isFlat) {
      this.gameService.onPieceClicked(this.location, this.color);
    }
  }
}
