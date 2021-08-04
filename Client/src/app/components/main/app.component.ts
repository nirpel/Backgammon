import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Backgammon';

  constructor(public socketService: SocketService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
