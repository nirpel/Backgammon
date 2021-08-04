import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/message.model';
import { SocketService } from '../socket/socket.service';

const URL = 'http://localhost:3420';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatUser: string;
  private chatId: string;
  messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private router: Router
  ) { 
    this.initSockets();
  }

  initSockets() {
    this.socketService.messageRecivedEvent.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  initChat(username: string) {
    this.chatUser = username;
    this.getChat().subscribe(
      (data) => {
        this.chatId = data.id;
        this.messages = data.messages;
      }
    );
    
    // at the end (TODO: add query string for identifyer?)
    this.router.navigate(['chat']);
  }

  isMessageSentByUser(message: Message): boolean {
    return message.sender !== this.chatUser;
  }

  sendMessage(messageContent: string): void {
    let message: Message = {
      message: messageContent,
      date: new Date(),
      sender: localStorage.getItem('username')
    };
    this.socketService.emitMessageSent(message, this.chatUser);
  }

  private getChat() {
    return this.http.get<Chat>(URL + '/api/chat/get-chat', {
      params: {
        chatUser: this.chatUser
      },
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    });
  }
}
