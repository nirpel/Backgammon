import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input()
  user: string

  @Input()
  isLoggedIn: boolean;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  chat(): void {
    this.chatService.initChat(this.user);
  }

}
