import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { UserProfile } from '../models/profile';
import { Credentials } from '../models/profile';
import { AWSCredentials } from '../models/profile';
import { OpenStackCredentials } from '../models/profile';
import { AzureCredentials } from '../models/profile';
import { GCECredentials } from '../models/profile';
import { CredVerificationResult } from '../models/profile';


@Injectable()
export class ProfileService {

    private _profile_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _creds_url_aws = `${this._profile_url}credentials/aws/`;
    private _creds_url_openstack = `${this._profile_url}credentials/openstack/`;
    private _creds_url_azure = `${this._profile_url}credentials/azure/`;
    private _creds_url_gce = `${this._profile_url}credentials/gce/`;
    private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/infrastructure/clouds/`;

    constructor(private http: HttpClient) { }

    public getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(this._profile_url);
    }

    public getCredentialsForCloud(cloud_id: string): Observable<Credentials[]> {
        const all_creds = this.getProfile().map(p => [].concat(p.aws_creds).concat(p.openstack_creds).concat(p.azure_creds).concat(p.gce_creds));
        return all_creds.map(creds => creds.filter(c => c && c.cloud.slug === cloud_id));
    }

    public getCredsForCloudFromProfile(profile: UserProfile, cloudId: string): Observable<Credentials[]> {
        return Observable.from([].concat(profile.aws_creds)
                               .concat(profile.openstack_creds)
                               .concat(profile.azure_creds))
                         .filter(c => c && c.cloud.slug === cloudId);
    }

    public saveCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this.http.put<AWSCredentials>(`${this._creds_url_aws}${creds.id}/`, creds)
            .catch(this.handleError);
    }

    public deleteCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this.http.delete(`${this._creds_url_aws}${creds.id}/`)
            .catch(this.handleError);
    }

    public createCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this.http.post<AWSCredentials>(`${this._creds_url_aws}`, creds)
            .catch(this.handleError);
    }

    public verifyCredentialsAWS(creds: AWSCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                                      creds, { headers: new HttpHeaders(headers) })
            .catch(this.handleError);
    }

    public saveCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this.http.put<OpenStackCredentials>(`${this._creds_url_openstack}${creds.id}/`, creds)
            .catch(this.handleError);
    }

    public deleteCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this.http.delete<OpenStackCredentials>(`${this._creds_url_openstack}${creds.id}/`)
            .catch(this.handleError);
    }

    public createCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this.http.post<OpenStackCredentials>(`${this._creds_url_openstack}`, creds)
            .catch(this.handleError);
    }

    public verifyCredentialsOpenStack(creds: OpenStackCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                                      creds, { headers: new HttpHeaders(headers) })
            .catch(this.handleError);
    }

    public saveCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this.http.put<AzureCredentials>(`${this._creds_url_azure}${creds.id}/`, creds)
            .catch(this.handleError);
    }

    public deleteCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this.http.delete<AzureCredentials>(`${this._creds_url_azure}${creds.id}/`)
            .catch(this.handleError);
    }

    public createCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this.http.post<AzureCredentials>(`${this._creds_url_azure}`, creds)
            .catch(this.handleError);
    }

    public verifyCredentialsAzure(creds: AzureCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                                      creds, { headers: new HttpHeaders(headers) })
            .catch(this.handleError);
    }

    public saveCredentialsGCE(creds: GCECredentials): Observable<GCECredentials> {
        return this.http.put<GCECredentials>(`${this._creds_url_gce}${creds.id}/`, creds)
            .catch(this.handleError);
    }

    public deleteCredentialsGCE(creds: GCECredentials): Observable<GCECredentials> {
        return this.http.delete<GCECredentials>(`${this._creds_url_gce}${creds.id}/`)
            .catch(this.handleError);
    }

    public createCredentialsGCE(creds: GCECredentials): Observable<GCECredentials> {
        return this.http.post<GCECredentials>(`${this._creds_url_gce}`, creds)
            .catch(this.handleError);
    }

    public verifyCredentialsGCE(creds: GCECredentials): Observable<CredVerificationResult> {
        let headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<GCECredentials>(`${this._application_url}${creds.cloud.slug}/authenticate/`, creds, { headers: new HttpHeaders(headers) })
            .catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        console.error(err);
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            return Observable.throw(err.message || err.error.message || 'Client error');
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            return Observable.throw(err.error || String(err) || 'Server error');
        }
    }
}

export function addCredentialHeaders(headers: any, credentials: Credentials) {
    if (credentials && credentials.cloud) {
        if (credentials.id) {
            // Must be a saved set or credentials. Retrieve using ID
            headers['cl-credentials-id'] = credentials.id;
            return;
        }
        // Must be an unsaved set of credentials
        switch (credentials.cloud.cloud_type) {
            case 'openstack':
                const os_creds = <OpenStackCredentials>credentials;
                headers['cl-os-username'] = os_creds.username;
                headers['cl-os-password'] = os_creds.password;
                headers['cl-os-project-name'] = os_creds.project_name;
                headers['cl-os-project-domain-name'] = os_creds.project_domain_name;
                headers['cl-os-user-domain-name'] = os_creds.user_domain_name;
                break;
            case 'aws':
                const aws_creds = <AWSCredentials>credentials;
                headers['cl-aws-access-key'] = aws_creds.access_key;
                headers['cl-aws-secret-key'] = aws_creds.secret_key;
                break;
            case 'azure':
                const azure_creds = <AzureCredentials>credentials;
                headers['cl-azure-subscription-id'] = azure_creds.subscription_id;
                headers['cl-azure-client-id'] = azure_creds.client_id;
                headers['cl-azure-secret'] = azure_creds.secret;
                headers['cl-azure-tenant'] = azure_creds.tenant;
                break;
            case 'gce':
                let gce_creds = <GCECredentials>credentials;
                // Parse then stringify credentials to remove any new lines
                headers['cl-gce-credentials-json'] = JSON.stringify(JSON.parse(gce_creds.credentials));
                break;
        }
    }
}
