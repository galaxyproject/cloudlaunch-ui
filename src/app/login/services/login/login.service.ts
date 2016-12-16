import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppSettings } from '../../../app.settings';


@Injectable()
export class LoginService {
    constructor(private _http: Http) { }

    private _loginUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/login/`;
    private _currentUserUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _login_method: string = null;

    public isLoggedIn(): Promise<boolean> {
        console.log("this._login_method at isLoggedIn: '" + this._login_method + "'");
        // When the SPA starts up, _login_method will be null
        let loginService = this;
        if (this._login_method == null) {
            return new Promise((resolve: any) => {
                this._http.get(this._currentUserUrl)
                    .map(response => response.json())
                    .do(function (item) {
                        // Cache the login method
                        //loginService._login_method = "session";
                        this._login_method = "session";
                    })
                    .subscribe(
                    data => resolve(true),
                    error => resolve(false)
                    );
            });
        }
        else { // _login_method is not null, figure out which case it is
            // _login_method will be empty when the SPA has started up, but the user has
            // manually logged out,
            if (this._login_method == "") {
                return Promise.resolve(false);
            }
            else if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
                console.log("sessionStorage has token");
                return Promise.resolve(true);
            }
            else if (this._login_method == "session") {
                // There's an ongoing session. Could be a token or a cookie
                console.log("Logged in through a session");
                return Promise.resolve(true);
            }
            else {
                return Promise.resolve(false);
            }
        }
    }

    public login(email: string, password: string, remember_me?: boolean): Observable<string> {
        let body = JSON.stringify({ "email": email, "password": password });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let loginService = this;
        return this._http.post(this._loginUrl, body, options)
            .map(res => <string>res.json().key)
            .do(function (item) {
                if (remember_me)
                    localStorage.setItem('token', item);
                else
                    sessionStorage.setItem('token', item);
                loginService._login_method = "token";
            })
            .catch(this.handleError);
    }

    public logout(): void {
        this._login_method = "";
        console.log("Set this._login_method to '" + this._login_method + "'");
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().non_field_errors || 'Server error');
    }
}
