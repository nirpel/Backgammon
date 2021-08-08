import { Component, Input, OnInit } from '@angular/core';
import { PieceColor } from 'src/app/models/backgammon/piece-color';
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

  constructor(private gameService: BackgammonService) { }

  ngOnInit(): void {
  }
}
