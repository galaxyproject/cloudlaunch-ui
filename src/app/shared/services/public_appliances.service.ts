import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CLAuthHttp } from '../../login/utils/cloudlaunch-http';
import { AppSettings } from '../../app.settings';
import { PublicService } from '../models/public_service';

@Injectable()
export class PublicAppliancesService {
    constructor(private _http: CLAuthHttp) { }

    private _public_services_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/public_services/`;


    public getPublicServices(): Observable<PublicService[]> {
        return this._http.get(this._public_services_url)
            .map(response => response.json().results);
    }

    public getPublicService(slug: string): Observable<PublicService> {
        return this._http.get(`${this._public_services_url}${slug}/`)
            .map(response => response.json());
    }

    public createPublicService(public_service: PublicService): Observable<PublicService> {
        let body = JSON.stringify(public_service);
        return this._http.post(this._public_services_url, body)
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json() || 'Server error');
    }

}
