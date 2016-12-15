import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppSettings } from '../../app.settings';
import { UserProfile } from '../models/profile';
import { Credentials } from '../models/profile';
import { AWSCredentials } from '../models/profile';
import { OpenStackCredentials } from '../models/profile';


@Injectable()
export class ProfileService {

    private _profile_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _creds_url_aws = `${this._profile_url}credentials/aws/`;
    private _creds_url_openstack = `${this._profile_url}credentials/openstack/`;

    constructor(private _http: Http) { }

    public getProfile(): Observable<UserProfile> {
        return this._http.get(this._profile_url)
            .map(response => response.json());
    }

    public getCredentialsForCloud(cloud_id: string): Observable<Credentials[]> {
        let all_creds = this.getProfile().map(p => [].concat(p.aws_creds).concat(p.openstack_creds));
        return all_creds.map(creds => creds.filter(c => c.cloud.slug === cloud_id));
    }

    public saveCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        let body = JSON.stringify(creds);
        return this._http.put(`${this._creds_url_aws}${creds.id}/`, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public deleteCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this._http.delete(`${this._creds_url_aws}${creds.id}/`)
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
        return this._http.put(`${this._creds_url_openstack}${creds.id}/`, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public deleteCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this._http.delete(`${this._creds_url_openstack}${creds.id}/`)
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
