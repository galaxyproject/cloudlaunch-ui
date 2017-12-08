import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';

@Component({
    selector: 'clui-logout-page',
    templateUrl: './logout-page.component.html',
    styleUrls: ['./logout-page.component.css']
})
export class LogoutPageComponent implements OnInit {

    constructor(
        private _loginService: LoginService) { }

    ngOnInit() {
        this._loginService.logout();
    }
}
