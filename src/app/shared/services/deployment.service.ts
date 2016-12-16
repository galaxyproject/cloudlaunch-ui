import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppSettings } from '../../app.settings';
import { Deployment } from '../models/deployment';

@Injectable()
export class DeploymentService {
    constructor(private _http: Http) { }

    private _deployment_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/deployments/`;


    public getDeployments(): Observable<Deployment[]> {
        return this._http.get(this._deployment_url)
            .map(response => response.json().results)
            .catch(this.handleError);
    }

    public getDeployment(slug: string): Observable<Deployment> {
        return this._http.get(`${this._deployment_url}${slug}/`)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public createDeployment(deployment: Deployment): Observable<Deployment> {
        let body = JSON.stringify(deployment);
        return this._http.post(this._deployment_url, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json() || 'Server error');
    }

}
