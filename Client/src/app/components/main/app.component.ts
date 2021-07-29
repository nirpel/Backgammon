import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Backgammon';

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.chatService.setupSocketConnection();
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
