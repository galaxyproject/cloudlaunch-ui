import { throwError as observableThrowError,  Observable } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { QueryResult } from '../models/query';
import { UserProfile } from '../models/profile';
import { AuthToken } from '../models/profile';
import { Credentials } from '../models/profile';
import { AWSCredentials } from '../models/profile';
import { OpenStackCredentials } from '../models/profile';
import { AzureCredentials } from '../models/profile';
import { GCPCredentials } from '../models/profile';
import { CredVerificationResult } from '../models/profile';


@Injectable()
export class ProfileService {

    private _profile_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/user/`;
    private _creds_url_aws = `${this._profile_url}credentials/aws/`;
    private _creds_url_openstack = `${this._profile_url}credentials/openstack/`;
    private _creds_url_azure = `${this._profile_url}credentials/azure/`;
    private _creds_url_gcp = `${this._profile_url}credentials/gcp/`;
    private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/infrastructure/clouds/`;
    private _auth_token_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/auth/tokens/`;

    constructor(private http: HttpClient) { }

    public getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(this._profile_url);
    }

    public getCredentialsForCloud(cloud_id: string): Observable<Credentials[]> {
        const all_creds = this.getProfile().pipe(map(p => [].concat(p.aws_creds, p.openstack_creds, p.azure_creds, p.gcp_creds)));
        return all_creds.pipe(map(creds => creds.filter(c => c && c.cloud.slug === cloud_id)));
    }

    public saveCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this.http.put<AWSCredentials>(`${this._creds_url_aws}${creds.id}/`, creds)
            .pipe(catchError(this.handleError));
    }

    public deleteCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this.http.delete<AWSCredentials>(`${this._creds_url_aws}${creds.id}/`)
            .pipe(catchError(this.handleError));
    }

    public createCredentialsAWS(creds: AWSCredentials): Observable<AWSCredentials> {
        return this.http.post<AWSCredentials>(`${this._creds_url_aws}`, creds)
            .pipe(catchError(this.handleError));
    }

    public verifyCredentialsAWS(creds: AWSCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                                      creds, { headers: new HttpHeaders(headers) })
            .pipe(catchError(this.handleError));
    }

    public saveCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this.http.put<OpenStackCredentials>(`${this._creds_url_openstack}${creds.id}/`, creds)
            .pipe(catchError(this.handleError));
    }

    public deleteCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this.http.delete<OpenStackCredentials>(`${this._creds_url_openstack}${creds.id}/`)
            .pipe(catchError(this.handleError));
    }

    public createCredentialsOpenStack(creds: OpenStackCredentials): Observable<OpenStackCredentials> {
        return this.http.post<OpenStackCredentials>(`${this._creds_url_openstack}`, creds)
            .pipe(catchError(this.handleError));
    }

    public verifyCredentialsOpenStack(creds: OpenStackCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                                      creds, { headers: new HttpHeaders(headers) })
            .pipe(catchError(this.handleError));
    }

    public saveCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this.http.put<AzureCredentials>(`${this._creds_url_azure}${creds.id}/`, creds)
            .pipe(catchError(this.handleError));
    }

    public deleteCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this.http.delete<AzureCredentials>(`${this._creds_url_azure}${creds.id}/`)
            .pipe(catchError(this.handleError));
    }

    public createCredentialsAzure(creds: AzureCredentials): Observable<AzureCredentials> {
        return this.http.post<AzureCredentials>(`${this._creds_url_azure}`, creds)
            .pipe(catchError(this.handleError));
    }

    public verifyCredentialsAzure(creds: AzureCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                                      creds, { headers: new HttpHeaders(headers) })
            .pipe(catchError(this.handleError));
    }

    public saveCredentialsGCE(creds: GCPCredentials): Observable<GCPCredentials> {
        return this.http.put<GCPCredentials>(`${this._creds_url_gcp}${creds.id}/`, creds)
            .pipe(catchError(this.handleError));
    }

    public deleteCredentialsGCE(creds: GCPCredentials): Observable<GCPCredentials> {
        return this.http.delete<GCPCredentials>(`${this._creds_url_gcp}${creds.id}/`)
            .pipe(catchError(this.handleError));
    }

    public createCredentialsGCE(creds: GCPCredentials): Observable<GCPCredentials> {
        return this.http.post<GCPCredentials>(`${this._creds_url_gcp}`, creds)
            .pipe(catchError(this.handleError));
    }

    public verifyCredentialsGCE(creds: GCPCredentials): Observable<CredVerificationResult> {
        const headers = {};
        addCredentialHeaders(headers, creds);
        return this.http.post<CredVerificationResult>(`${this._application_url}${creds.cloud.slug}/authenticate/`,
                                              creds, { headers: new HttpHeaders(headers) })
            .pipe(catchError(this.handleError));
    }

    public getAuthTokens(): Observable<AuthToken[]> {
        const url = `${this._auth_token_url}`;
        return this.http.get<QueryResult<AuthToken>>(url).pipe(
            map(response => response.results),
            catchError(this.handleError));
    }

    public createAuthToken(token: AuthToken): Observable<AuthToken> {
        return this.http.post<AuthToken>(`${this._auth_token_url}`, token)
            .pipe(catchError(this.handleError));
    }

    public deleteAuthToken(token: AuthToken): Observable<AuthToken> {
        return this.http.delete<AuthToken>(`${this._auth_token_url}${token.id}/`)
            .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        console.error(err);
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            return observableThrowError(err.message || err.error.message || 'Client error');
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            return observableThrowError(err.error || String(err) || 'Server error');
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
                headers['cl-azure-resource-group'] = azure_creds.resource_group;
                headers['cl-azure-storage-account'] = azure_creds.storage_account;
                headers['cl-azure-vm-default-username'] = azure_creds.vm_default_username;
                break;
            case 'gcp':
                const gcp_creds = <GCPCredentials>credentials;
                // Parse then stringify credentials to remove any new lines
                headers['cl-gcp-credentials-json'] = JSON.stringify(JSON.parse(gcp_creds.credentials));
                break;
        }
        // Angular doesn't like empty header values, so trim empty values
        for (const h in headers) {
            if (!headers[h]) {
                delete (headers[h]);
            }
        }
    }
}
