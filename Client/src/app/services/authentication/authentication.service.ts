import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  login(user: Login): Observable<any> {
    return this.http.post(environment.SERVER_URL + '/api/auth/signin', user);
  }

  signUp(user: Login): Observable<any> {
    return this.http.post(environment.SERVER_URL + '/api/auth/signup', user);
  }
}
