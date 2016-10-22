import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule }  from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LoginModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
