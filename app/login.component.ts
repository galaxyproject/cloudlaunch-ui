import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { LoginService } from './login.service';

@Component({
    selector: 'login',
    templateUrl: 'app/login.component.html',
    styleUrls: ['app/login.component.css'],
})
export class LoginComponent implements OnInit {
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
                     data  => this._router.parent.navigate(['Home']),
                     error => this.errorMessage = <any>error);
    }
}