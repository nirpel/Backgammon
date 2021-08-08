import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { BoardComponent } from './components/backgammon/board/board.component';
import { ChatComponent } from './components/chat/chat/chat.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { AuthenticationService } from './services/authentication/authentication.service';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'backgammon', component: BoardComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
