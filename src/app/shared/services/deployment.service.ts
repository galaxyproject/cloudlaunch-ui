import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/from';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { Deployment } from '../models/deployment';
import { UserProfile, Credentials } from '../models/profile';
import { Task } from '../models/task';
import { QueryResult } from '../models/query';


@Injectable()
export class DeploymentService {
    constructor(private http: HttpClient) { }

    private _deployment_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/deployments/`;


    public getDeployments(options = {}): Observable<Deployment[]> {
        const defaultOptions: any = {
            archived: null,
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        let url = `${this._deployment_url}`;
        if (finalOptions.archived !== null) {
            url = `${url}?archived=${finalOptions.archived}`;
        }
        return this.http.get<QueryResult<Deployment>>(url)
            .map(response => response.results)
            .catch(this.handleError);
    }

    public getCredsForDeployment(deployment: Deployment, profile: UserProfile): Observable<Credentials> {
        const allDepCreds = [].concat(profile.aws_creds)
                              .concat(profile.openstack_creds)
                              .concat(profile.azure_creds)
                              .concat(profile.gce_creds)
                              .filter(c => c && c.cloud.slug === deployment.target_cloud);

        // If credentials are associated with this deployment, return that or return the first
        // set of default credentials for the deployment's target cloud.
        if (deployment.credentials) {
            return Observable.from(allDepCreds.filter(c => c.id === deployment.credentials));
        } else {
            return Observable.from(allDepCreds.filter(credential => credential.default));
        }
    }

    public getDeployment(slug: string): Observable<Deployment> {
        return this.http.get<Deployment>(`${this._deployment_url}${slug}/`)
            .catch(this.handleError);
    }

    public createDeployment(deployment: Deployment): Observable<Deployment> {
        return this.http.post<Deployment>(this._deployment_url, deployment)
            .catch(this.handleError);
    }

    public updateDeployment(deployment: Deployment): Observable<Deployment> {
        return this.http.put<Deployment>(`${this._deployment_url}${deployment.id}/`, deployment)
            .catch(this.handleError);
    }

    public createTask(slug: string, task: string): Observable<Task> {
        // TODO: make this an enum?
        const body = {'action': task};
        return this.http.post<Deployment>(`${this._deployment_url}${slug}/tasks/`, body)
            .catch(this.handleError);
    }

    public getTasks(slug: string): Observable<Task[]> {
        return this.http.get<QueryResult<Task>>(`${this._deployment_url}${slug}/tasks/`)
            .map(response => response.results)
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
