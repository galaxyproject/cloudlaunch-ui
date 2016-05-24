import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class LoginService {
   constructor(private _http: Http) { }

   // TODO: This needs to be obtained from some global config
   private _loginUrl = 'http://localhost:8000/api/v1/auth/login/';
   private _currentUserUrl = 'http://localhost:8000/api/v1/auth/user/';
   private _login_method = null;

   public isLoggedIn(): Promise<boolean> {
      // When the SPA starts up, _login_method will be null
      let loginService = this;
      if (this._login_method == null) {
         return new Promise((resolve) => {
            this._http.get(this._currentUserUrl)
               .map(response => response.json())
               .do(function (item) {
                  // Cache the login method
                  loginService._login_method = "token";
               })
               .subscribe(
                  data => resolve(true),
                  error => resolve(false)
               );
         });
      }
      // _login_method will be empty when the SPA has started up, but the user has
      // manually logged out,
      else if (this._login_method == "") {
         return Promise.resolve(false);
      }
      else if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
         return Promise.resolve(true);
      }
      else {
         return Promise.resolve(false);
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
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
   }

   private handleError(error: Response) {
      return Observable.throw(error.json().non_field_errors || 'Server error');
   }
}
