import { Component, ComponentFactory, ComponentFactoryResolver, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { PieceColor } from 'src/app/models/backgammon/piece-color';
import { BackgammonService } from 'src/app/services/backgammon/backgammon.service';
import { PieceComponent } from '../piece/piece.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  white: PieceColor = PieceColor.White;
  black: PieceColor = PieceColor.Black;
  @ViewChildren('bar', { read: ViewContainerRef }) bars: QueryList<ViewContainerRef>;

  constructor(
    public gameService: BackgammonService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initGame();
  }

  initGame(): void {
    this.clearBoard();
    this.appendPieces();
  }

  clearBoard(): void {
    for (let i = 0; i < this.bars.length; i++) {
      this.bars.get(i).clear();
    }
  }

  private getBarGameIndexer(indexInArray: number): number {
    for (let i = 0; i < 12; i++) {
      if (indexInArray === i) {
        if (this.gameService.playerColor === this.white)
          return 11 - i;
        else return i + 12;
      }
    }
    for (let i = 12; i < 24; i++) {
      if (indexInArray === i) {
        if (this.gameService.playerColor === this.white)
          return i;
        else return 23 - i;
      }
    }
  }

  appendPieces(): void {
    for (let i = 0; i < 15; i++) {
      if (this.gameService.isPieceOnBoard(i, PieceColor.White)) {
        this.addPiece(this.gameService.board.whitesLocations[i], PieceColor.White);
      }
      if (this.gameService.isPieceOnBoard(i, PieceColor.Black)) {
        this.addPiece(this.gameService.board.blacksLocations[i], PieceColor.Black);
      }
    }
  }

  addPiece(barId: number, color: PieceColor): void {
    for (let i = 0; i < this.bars.length; i++) {
      if (this.getBarGameIndexer(i) == barId) {
        this.gameService.newPieceColor = color;
        const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(PieceComponent);
        const viewContainerRef = this.bars.get(i);        
        viewContainerRef.createComponent(componentFactory).changeDetectorRef.detectChanges();
      }
    }
  }
}
