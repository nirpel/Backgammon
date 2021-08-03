import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Login } from '../../models/login.model';

const URL = 'http://localhost:3420';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(user: Login): Observable<any> {
    return this.http.post(URL + '/api/auth/signin', user);
  }

  signUp(user: Login): Observable<any> {
    return this.http.post(URL + '/api/auth/signup', user);
  }

  logout(): Observable<any> {
    return this.http.post(URL + '/api/auth/signout', JSON.stringify('hi'));
  }
}
