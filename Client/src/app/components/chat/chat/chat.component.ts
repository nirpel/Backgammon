import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  newMessage: string = '';

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
  }

  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim()) {
      console.log(this.newMessage);
      this.chatService.sendMessage(this.newMessage);
      // TODO:
      //  send message using socketService (by chatService)
      //  save message to db
      //  show new message in messages history
    }
    // clear message & input box
    this.newMessage = '';
  }

}
