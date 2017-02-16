import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CLAuthHttp } from '../../utils/cloudlaunch-http';
import { AppSettings } from '../../../app.settings';
import { User } from '../../../shared/models/user';


@Injectable()
export class LoginService {
    constructor(private _http: CLAuthHttp) { }

    private _loginUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/login/`;
    private _logoutUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/logout/`;
    private _currentUserUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _login_method: string = null;
    private _current_user: User = null;

    public isLoggedIn(): Promise<boolean> {
        // When the SPA starts up, _login_method will be null
        let loginService = this;
        if (this._login_method == null) {
            return new Promise((resolve: any) => {
                this._http.get(this._currentUserUrl)
                    .map(response => response.json())
                    .do(function (item) {
                        // Cache the login method
                        loginService._current_user = item;
                        loginService._login_method = "session";
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
                return Promise.resolve(true);
            }
            else if (this._login_method == "session") {
                // There's an ongoing session. Could be a token or a cookie
                return Promise.resolve(true);
            }
            else {
                return Promise.resolve(false);
            }
        }
    }

    public getCurrentUser() {
        return this._current_user;
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

    public logout(): Observable<string> {
        let loginService = this;
        loginService._login_method = null;
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        return this._http.post(this._logoutUrl, "")
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().non_field_errors || 'Server error');
    }
}
