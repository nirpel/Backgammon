import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/message.model';
import { environment } from 'src/environments/environment.prod';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messagePushedEvent: EventEmitter<any> = new EventEmitter();
  chatUser: string;
  messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private router: Router
  ) {
    this.initSockets();
  }

  initSockets() {
    this.socketService.messageRecived.subscribe((message: Message) => {
      if (this.chatUser === message.sender) {
        this.pushMessage(message);
      } else {
        // TODO: make sound and mark required chat;
      }
    });
  }

  initChat(username: string) {
    this.chatUser = username;
    this.getChat().subscribe(
      (data) => {
        this.messages = data.messages.sort(this.compareByDate);
      }, (err) => {
        this.router.navigate(['home']);
      }
    );
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
    this.pushMessage(message);
    this.socketService.emitMessageSent(message, this.chatUser);
  }

  private pushMessage(message: Message): void {
    this.messages.push(message);
    this.messagePushedEvent.emit();
  }

  private getChat() {
    return this.http.get<Chat>(environment.SERVER_URL + '/api/chat/get-chat', {
      params: {
        chatUser: this.chatUser
      },
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    });
  }

  private compareByDate(message1: Message, message2: Message) {
    if (message1.date < message2.date) {
      return -1;
    }
    if (message1.date > message2.date) {
      return 1;
    }
    return 0;
  }
}
