import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input()
  message: Message;

  @Input()
  isSentByUser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  timeString() {
    let dateTime = new Date(this.message.date);
    return dateTime.toLocaleDateString();
  }
}
