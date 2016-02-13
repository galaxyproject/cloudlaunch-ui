import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

@Component({
    selector: 'login',
    templateUrl: 'app/login.component.html',
    styleUrls: ['app/login.component.css'],
})
export class LoginComponent implements OnInit {
    constructor(
        private _router: Router) { }

    ngOnInit() {
    }
}