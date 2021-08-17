import { EventEmitter, Injectable } from '@angular/core';
import { GameInit } from 'src/app/models/backgammon/game-init.model';
import { SocketService } from '../socket/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { GameInviteDialogComponent } from 'src/app/components/backgammon/game-invite-dialog/game-invite-dialog.component';
import { BackgammonService } from '../backgammon/backgammon.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private socketService: SocketService,
    private backgammonService: BackgammonService,
    public dialog: MatDialog) { }

  listen() {
    this.socketService.backgammonInviteRequest.subscribe((fromUsername) => {
      this.dialog.open(GameInviteDialogComponent, {
        data: fromUsername
      });
    });
    this.socketService.backgammonInviteAccepted.subscribe((initGameData) => {
      this.backgammonService.initGame(initGameData);
      this.dialog.closeAll();
    });
    this.socketService.backgammonInviteRejected.subscribe(() => {
      this.dialog.closeAll();
    })
  }
}
