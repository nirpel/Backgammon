import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { faPaperPlane, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatScroller') private chatScroller: ElementRef;
  newMessage: string = '';
  sendIcon: IconDefinition = faPaperPlane;

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
    this.scrollToBottom();
    this.chatService.messagePushedEvent.subscribe(this.scrollToBottom);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim()) {
      console.log(this.newMessage);
      this.chatService.sendMessage(this.newMessage);
    }
    // clear message & input box
    this.newMessage = '';
  }

  scrollToBottom(): void {
    try {
      this.chatScroller.nativeElement.scrollTop = this.chatScroller.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
