import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';

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

  connectionIcon: IconDefinition = faDotCircle;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  chat(): void {
    this.router.navigate(['chat'], { queryParams: { user: this.user } });
  }

}
