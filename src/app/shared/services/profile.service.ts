import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CLAuthHttp } from '../../login/utils/cloudlaunch-http';
import { AppSettings } from '../../app.settings';
import { UserProfile } from '../models/profile';
import { Credentials } from '../models/profile';
import { AWSCredentials } from '../models/profile';
import { OpenStackCredentials } from '../models/profile';
import { AzureCredentials } from '../models/profile';
import { CredVerificationResult } from '../models/profile';


@Injectable()
export class ProfileService {

    private _profile_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _creds_url_aws = `${this._profile_url}credentials/aws/`;
    private _creds_url_openstack = `${this._profile_url}credentials/openstack/`;
    private _creds_url_azure = `${this._profile_url}credentials/azure/`;
    private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/infrastructure/clouds/`;

    constructor(private _http: CLAuthHttp) { }

    public getProfile(): Observable<UserProfile> {
        return this._http.get(this._profile_url)
            .map(response => response.json());
    }

    public getCredentialsForCloud(cloud_id: string): Observable<Credentials[]> {
        let all_creds = this.getProfile().map(p => [].concat(p.aws_creds).concat(p.openstack_creds).concat(p.azure_creds));
        return all_creds.map(creds => creds.filter(c => c && c.cloud.slug === cloud_id));
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
    
    public verifyCredentialsAWS(creds: AWSCredentials): Observable<CredVerificationResult> {
        let body = JSON.stringify(creds);
        this._http.setCloudCredentials(creds);
        return this._http.post(`${this._application_url}${creds.cloud.slug}/authenticate/`, body)
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
    
    public verifyCredentialsOpenStack(creds: OpenStackCredentials): Observable<CredVerificationResult> {
        let body = JSON.stringify(creds);
        this._http.setCloudCredentials(creds);
        return this._http.post(`${this._application_url}${creds.cloud.slug}/authenticate/`, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public saveCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        let body = JSON.stringify(creds);
        return this._http.put(`${this._creds_url_azure}${creds.id}/`, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public deleteCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this._http.delete(`${this._creds_url_azure}${creds.id}/`)
            .catch(this.handleError);
    }

    public createCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        let body = JSON.stringify(creds);
        return this._http.post(`${this._creds_url_azure}`, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public verifyCredentialsAzure(creds: AzureCredentials): Observable<CredVerificationResult> {
        let body = JSON.stringify(creds);
        this._http.setCloudCredentials(creds);
        return this._http.post(`${this._application_url}${creds.cloud.slug}/authenticate/`, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json() || 'Server error');
    }

}
