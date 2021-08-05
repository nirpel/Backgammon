import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Login } from '../../models/login.model';
import { SocketService } from '../socket/socket.service';

const URL = 'http://localhost:3420';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient, 
    private socketService: SocketService,
    private router: Router
    ) { }

  login(user: Login): Observable<any> {
    return this.http.post(URL + '/api/auth/signin', user);
  }

  signUp(user: Login): Observable<any> {
    return this.http.post(URL + '/api/auth/signup', user);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.socketService.isConnected()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
