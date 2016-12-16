import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { AppSettings } from '../../../app.settings';

@Component({
    selector: 'app-login-box',
    templateUrl: './login-box.component.html',
    styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent implements OnInit {
    public email: string;
    public password: string;
    public rememberMe: boolean = false;
    public errorMessage: string;

    constructor(
        private _router: Router,
        private _loginService: LoginService) { }

    ngOnInit() {
    }

    onSubmit() {
        this.errorMessage = null;
        this._loginService.login(this.email, this.password, this.rememberMe).subscribe(
            data => this._router.navigate(['/marketplace']),
            error => this.errorMessage = <any>error);
    }

    getApiRoot(): string {
        return AppSettings.CLOUDLAUNCH_SERVER_ROOT;
    }
}
