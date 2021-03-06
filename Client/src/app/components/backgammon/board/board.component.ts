import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { PieceColor } from 'src/app/models/backgammon/piece-color.model';
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
  optionalBarsIndexes: number[] = [];
  @ViewChildren('bar', { read: ViewContainerRef }) barContainers: QueryList<ViewContainerRef>;
  @ViewChild('graveyard', { read: ViewContainerRef }) graveyardContainer: ViewContainerRef;
  @ViewChild('opponentPocket', { read: ViewContainerRef }) opponentPocketContainer: ViewContainerRef;
  @ViewChild('playerPocket', { read: ViewContainerRef }) playerPocketContainer: ViewContainerRef;

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
    this.listen();
  }

  clearBoard(): void {
    for (let i = 0; i < this.barContainers.length; i++) {
      this.barContainers.get(i).clear();
    }
    this.graveyardContainer.clear();
    this.opponentPocketContainer.clear();
    this.playerPocketContainer.clear();
  }

  onBarClick(index: number): void {
    let barIndex: number = index < 24 ? this.getBarGameIndexer(index) : index;
    if (this.optionalBarsIndexes.includes(barIndex)) {
      this.gameService.movePiece(barIndex);
    }
  }

  appendPieces(): void {
    for (let i = 0; i < 15; i++) {
      this.addPiece(this.gameService.board.whitesLocations[i], PieceColor.White);
      this.addPiece(this.gameService.board.blacksLocations[i], PieceColor.Black);
    }
  }

  addPiece(barId: number, color: PieceColor): void {
    if (barId === 24) {
      this.addPieceToPocket(color);
    }
    else if (barId === -1) {
      this.addPieceToGraveyard(color);
    } else {
      this.addPieceToBoard(barId, color);
    }
  }

  private addPieceToBoard(location: number, color: PieceColor) {
    for (let i = 0; i < this.barContainers.length; i++) {
      if (this.getBarGameIndexer(i) === location) {
        const componentFactory = this.getPieceComponentFactory(color);
        const viewContainerRef = this.barContainers.get(i);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.location = location;
        componentRef.changeDetectorRef.detectChanges();
      }
    }
  }

  private addPieceToGraveyard(color: PieceColor) {
    const componentRef = this.graveyardContainer.createComponent(this.getPieceComponentFactory(color));
    componentRef.instance.location = -1;
    componentRef.changeDetectorRef.detectChanges();
  }

  private addPieceToPocket(color: PieceColor) {
    let componentRef: ComponentRef<PieceComponent>;
    if (color === this.gameService.playerColor) {
      componentRef = this.playerPocketContainer.createComponent(this.getPieceComponentFactory(color));
    } else {
      componentRef = this.opponentPocketContainer.createComponent(this.getPieceComponentFactory(color));
    }
    componentRef.instance.location = 24;
    componentRef.instance.isFlat = true;
    componentRef.changeDetectorRef.detectChanges();
  }

  private getPieceComponentFactory(color: PieceColor) {
    this.gameService.newPieceColor = color;
    return this.componentFactoryResolver.resolveComponentFactory(PieceComponent);
  }

  private listen() {
    this.gameService.moveOptionsArrived.subscribe(() => {
      this.onMoveOptionsArrived();
    });
    this.gameService.boardChanged.subscribe(() => {
      this.onBoardChanged();
    })
  }

  private onBoardChanged() {
    this.clearBoard();
    this.appendPieces();
  }

  private onMoveOptionsArrived() {
    this.optionalBarsIndexes = this.gameService.currentMoveOptions.map(option => option.newLocation);
  }

  getBarGameIndexer(indexInArray: number): number {
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
}
