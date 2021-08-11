import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserService } from 'src/app/services/user/user.service';
import { Login } from '../../../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Login = {
    username: null,
    password: null
  };

  constructor(public authService: AuthenticationService, public socketService: SocketService, private router: Router) { }

  ngOnInit(): void { }

  login(): void {
    this.authService.login(this.user).subscribe(
      (data) => {
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('username', data.username);
        }
      },
      (err) => {
        this.errorMessage();
      },
      () => {
        this.socketService.setupSocketConnection();
        this.router.navigate(['home']);
      }
    )
  }

  goToSignUp(): void {
    this.router.navigate(['signup']);
  }

  // TODO: Implement correctly and cross-error
  errorMessage() {
    alert("NOT OK.")
  }

}
