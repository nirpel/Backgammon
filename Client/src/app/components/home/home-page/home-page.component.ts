import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(public userService: UserService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.listen();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }
}
