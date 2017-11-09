import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { PublicService } from '../models/public_service';
import { QueryResult } from '../models/query';


@Injectable()
export class PublicAppliancesService {
    constructor(private http: HttpClient) { }

    private _public_services_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/public_services/services/`;


    public getPublicServices(): Observable<PublicService[]> {
        return this.http.get<QueryResult<PublicService>>(this._public_services_url)
            .map(response => response.results);
    }

    public getPublicService(slug: string): Observable<PublicService> {
        return this.http.get<PublicService>(`${this._public_services_url}${slug}/`);
    }

    public createPublicService(public_service: PublicService): Observable<PublicService> {
        return this.http.post<PublicService>(this._public_services_url, public_service)
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
