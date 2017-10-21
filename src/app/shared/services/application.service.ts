import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CLAuthHttp } from '../../login/utils/cloudlaunch-http';
import { AppSettings } from '../../app.settings';
import { Application } from '../models/application';

@Injectable()
export class ApplicationService {
    constructor(private _http: CLAuthHttp) { }

    private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/applications/`;


    public getApplications(filter?: string, page?: number, page_size = 6): Observable<Application[]> {
        console.log(`Searching for: ${filter}`)
        let query_url = `${this._application_url}?`;
        if (filter)
            query_url = `${query_url}search=${filter}&`;
        if (page)
            query_url = `${query_url}page=${page}&`;
        if (page_size)
            query_url = `${query_url}page_size=${page_size}&`;
        return this._http.get(query_url)
            .map(response => response.json().results);
    }

    public getApplication(slug: string): Observable<Application> {
        return this._http.get(`${this._application_url}${slug}/`)
            .map(response => response.json());
    }
}
