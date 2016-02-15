import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class LoginService {
    constructor (private _http: Http) {}
    
    // TODO: This need to be obtained from some global config
    private _loginUrl = 'http://localhost:8000/api/v1/auth/login/';

    isLoggedIn() {
    }
    
    login(email: string, password: string, remember_me?: boolean) {
        let body = JSON.stringify({ "email" : email, "password" : password });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this._loginUrl, body, options)
                         .map(res => <string> res.json().key)
                         .catch(this.handleError);
    }
    
    logout() {
    }
    
    private handleError (error: Response) {
        return Observable.throw(error.json().non_field_errors || 'Server error');
    }
}