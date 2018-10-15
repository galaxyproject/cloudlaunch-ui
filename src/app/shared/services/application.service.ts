import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { Application } from '../models/application';
import { QueryResult } from '../models/query';

@Injectable()
export class ApplicationService {
    constructor(private http: HttpClient) { }

    private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/applications/`;


    public getApplications(): Observable<Application[]> {
        return this.http.get<QueryResult<Application>>(this._application_url).pipe(
            map(qr => qr.results));
    }

    public queryApplications(filter?: string, page?: number, page_size?: number): Observable<QueryResult<Application>> {
        let query_url = `${this._application_url}?`;
        if (filter) {
            query_url = `${query_url}search=${filter}&`;
        }
        if (page) {
            query_url = `${query_url}page=${page}&`;
        }
        if (page_size) {
            query_url = `${query_url}page_size=${page_size}&`;
        }
        return this.http.get<QueryResult<Application>>(query_url);
    }

    public getApplication(slug: string): Observable<Application> {
        return this.http.get<Application>(`${this._application_url}${slug}/`);
    }
}
