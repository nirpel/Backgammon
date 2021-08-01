import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: Login = {
    username: null,
    password: null
  };

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void { }

  signUp(): void {
    if (this.user.username && this.user.password) {
      this.authService.signUp(this.user).subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          this.errorMessage();
        },
        () => {
          alert('User created successfuly!');
          this.goToLogin();
        }
      );
    } else {
      this.errorMessage();
    }
  }

  goToLogin(): void {
    this.router.navigate(['']);
  }

  // TODO: Implement correctly and cross-error
  errorMessage() {
    alert("NOT OK.")
  }
}
