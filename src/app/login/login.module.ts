import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { LayoutModule } from '../shared/layout.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    LoginRoutingModule
  ],
  declarations: [LoginPageComponent]
})
export class LoginModule { }
