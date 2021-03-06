import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/main/app.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { MessageComponent } from './components/chat/message/message.component';
import { ChatComponent } from './components/chat/chat/chat.component';
import { UserListComponent } from './components/home/user-list/user-list.component';
import { UserComponent } from './components/home/user/user.component';
import { BoardComponent } from './components/backgammon/board/board.component';
import { PieceComponent } from './components/backgammon/piece/piece.component';
import { GameInviteDialogComponent } from './components/backgammon/game-invite-dialog/game-invite-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiceComponent } from './components/backgammon/dice/dice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomePageComponent,
    MessageComponent,
    ChatComponent,
    UserListComponent,
    UserComponent,
    BoardComponent,
    PieceComponent,
    GameInviteDialogComponent,
    DiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
