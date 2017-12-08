import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/do';

import { AppSettings } from '../../../app.settings';
import { User } from '../../../shared/models/user';
import { Credentials } from '../../../shared/models/profile';
import { addCredentialHeaders } from '../../../shared/services/profile.service';


@Injectable()
export class LoginService {
    constructor(private http: HttpClient) { }

    private _loginUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/login/`;
    private _logoutUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/logout/`;
    private _currentUserUrl = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _login_method: string = null;
    private _current_user: User = null;
    private credentials: Credentials = null;

    public isLoggedIn(): Promise<boolean> {
        // When the SPA starts up, _login_method will be null
        const loginService = this;
        if (this._login_method == null) {
            return new Promise((resolve: any) => {
                this.http.get(this._currentUserUrl)
                    .catch((err: HttpErrorResponse) => {
                        loginService._current_user = null;
                        return Observable.throw(err);
                    })
                    .do(function (item) {
                        // Cache the login method
                        loginService._current_user = item;
                        loginService._login_method = 'session';
                    })
                    .subscribe(
                        data => resolve(true),
                        error => resolve(false)
                    );
            });
        } else { // _login_method is not null; figure out which case it is.
            // _login_method will be empty when the SPA has started up, but the
            // user has manually logged out.
            if (this._login_method === '') {
                return Promise.resolve(false);
            } else if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
                return Promise.resolve(true);
            } else if (this._login_method === 'session') {
                // There's an ongoing session. Could be a token or a cookie
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        }
    }

    public getCurrentUser() {
        return this._current_user;
    }

    public login(email: string, password: string, remember_me?: boolean): Observable<string> {
        const body = { 'email': email, 'password': password };
        const loginService = this;
        return this.http.post(this._loginUrl, body)
            .map(res => res['key'])
            .do(function (item) {
                if (remember_me) {
                    localStorage.setItem('token', item);
                } else {
                    sessionStorage.setItem('token', item);
                }
                loginService._login_method = 'token';
            })
            .catch(this.handleError);
    }

    public logout(): Observable<string> {
        this._login_method = null;
        this.credentials = null;
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        return this.http.post(this._logoutUrl, '')
            .catch(this.handleError);
    }

    private handleError(error: HttpErrorResponse) {
        return Observable.throw((<any>error).non_field_errors || 'Server error');
    }

    public setCloudCredentials(credentials: Credentials) {
        this.credentials = credentials;
    }

    public getDefaultHeaders(): Object {
        const headers = {};
        if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
            const auth_header = 'Token ' + sessionStorage.getItem('token') || localStorage.getItem('token');
            headers['Authorization'] = auth_header;
        }

        addCredentialHeaders(headers, this.credentials);
        return headers;
    }
}
