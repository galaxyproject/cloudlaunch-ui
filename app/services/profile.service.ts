import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppSettings } from '../app.settings';
import { UserProfile } from '../models/profile';
import { AWSCredentials } from '../models/profile';
import { OpenStackCredentials } from '../models/profile';


@Injectable()
export class ProfileService {


   constructor(private _http: Http) { }

   private _profile_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
   private _creds_url_aws = `${this._profile_url}credentials/aws/`;
   private _creds_url_openstack = `${this._profile_url}credentials/openstack/`;


   public getProfile(): Observable<UserProfile> {
      return this._http.get(this._profile_url)
         .map(response => response.json());
   }

   public saveCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
      let body = JSON.stringify(creds);
      return this._http.put(`${this._creds_url_aws}${creds.id}/`, body)
         .map(response => response.json())
         .catch(this.handleError);
   }

   public createCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
      let body = JSON.stringify(creds);
      return this._http.post(`${this._creds_url_aws}`, body)
         .map(response => response.json())
         .catch(this.handleError);
   }

   public saveCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
      let body = JSON.stringify(creds);
      return this._http.post(`${this._creds_url_openstack}${creds.id}/`, body)
         .map(response => response.json())
         .catch(this.handleError);
   }

   public createCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
      let body = JSON.stringify(creds);
      return this._http.post(`${this._creds_url_openstack}`, body)
         .map(response => response.json())
         .catch(this.handleError);
   }

   private handleError(error: Response) {
      return Observable.throw(error.json() || 'Server error');
   }

}
