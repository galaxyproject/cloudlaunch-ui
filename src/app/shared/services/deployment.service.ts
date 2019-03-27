import { throwError as observableThrowError,  Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { CloudDeploymentTarget, Deployment } from '../models/deployment';
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
        return this.http.get<QueryResult<Deployment>>(url).pipe(
            map(response => response.results),
            catchError(this.handleError));
    }

    public getCredsForDeployment(deployment: Deployment, profile: UserProfile): Observable<Credentials> {
        const allDepCreds = profile.credentials.filter(
            c => c && c.cloud.id === (<CloudDeploymentTarget>deployment.deployment_target).target_zone.cloud_id);

        // If credentials are associated with this deployment, return that or return the first
        // set of default credentials for the deployment's target cloud.
        if (deployment.credentials) {
            return from(allDepCreds.filter(c => c.id === deployment.credentials));
        } else {
            return from(allDepCreds.filter(credential => credential.default));
        }
    }

    public getDeployment(deployment_id: string): Observable<Deployment> {
        return this.http.get<Deployment>(`${this._deployment_url}${deployment_id}/`)
            .pipe(catchError(this.handleError));
    }

    public createDeployment(deployment: Deployment): Observable<Deployment> {
        return this.http.post<Deployment>(this._deployment_url, deployment)
            .pipe(catchError(this.handleError));
    }

    public updateDeployment(deployment: Deployment): Observable<Deployment> {
        if (!deployment.deployment_target_id) {
            deployment.deployment_target_id = deployment.deployment_target.id;
        }
        return this.http.put<Deployment>(`${this._deployment_url}${deployment.id}/`, deployment)
            .pipe(catchError(this.handleError));
    }

    public createTask(slug: string, task: string): Observable<Task> {
        // TODO: make this an enum?
        const body = {'action': task};
        return this.http.post<Task>(`${this._deployment_url}${slug}/tasks/`, body)
            .pipe(catchError(this.handleError));
    }

    public getTasks(slug: string): Observable<Task[]> {
        return this.http.get<QueryResult<Task>>(`${this._deployment_url}${slug}/tasks/`)
            .pipe(
                    map(response => response.results),
                    catchError(this.handleError));
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
