import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { faPaperPlane, IconDefinition, faDice, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { BackgammonService } from 'src/app/services/backgammon/backgammon.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatScroller') private chatScroller: ElementRef;
  newMessage: string = '';
  sendIcon: IconDefinition = faPaperPlane;
  backIcon: IconDefinition = faArrowLeft;
  playIcon: IconDefinition = faDice;
  sub: Subscription;

  constructor(
    public chatService: ChatService,
    private userService: UserService,
    private notificationService: NotificationService,
    private backgammonService: BackgammonService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userService.initUsersLists();
    this.initializeChat();
    this.scrollToBottom();
    this.chatService.messagePushedEvent.subscribe(this.scrollToBottom);
    this.notificationService.listen();
  }

  initializeChat(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      if (params['user']) {
        this.chatService.initChat(params['user']);
      }
      else {
        this.router.navigate(['home']);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  redirect(): void {
    this.router.navigate(['home']);
  }

  showOptions(): void {
    this.backgammonService.inviteToPlay(this.chatService.chatUser);
  }

}
