import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackgammonService } from 'src/app/services/backgammon/backgammon.service';

@Component({
  selector: 'app-game-invite-dialog',
  templateUrl: './game-invite-dialog.component.html',
  styleUrls: ['./game-invite-dialog.component.css']
})
export class GameInviteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private backgammonService: BackgammonService) { }

  ngOnInit(): void {
  }

  acceptInvite(): void {
    this.backgammonService.respondToInvite(true, this.data);
  }

  declineInvite(): void {
    this.backgammonService.respondToInvite(false, this.data);
  }

}
