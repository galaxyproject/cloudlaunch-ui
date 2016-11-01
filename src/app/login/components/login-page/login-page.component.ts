import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class LoginPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
