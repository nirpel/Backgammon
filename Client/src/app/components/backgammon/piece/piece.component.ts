import { Component, Input, OnInit } from '@angular/core';
import { PieceColor } from 'src/app/models/backgammon/piece-color';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {

  white: PieceColor = PieceColor.White;
  black: PieceColor = PieceColor.Black;
  @Input() color: PieceColor;

  constructor() { }

  ngOnInit(): void {
  }
}
