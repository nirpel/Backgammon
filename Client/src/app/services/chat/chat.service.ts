import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';

const URL = 'http://localhost:3420';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatUser: string;
  private chatData: Chat;

  constructor(private http: HttpClient) { }

  initChat(username: string) {
    this.chatUser = username;
    this.getChat().subscribe(
      (data) => {
        this.chatData = data;
      }
    );
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
