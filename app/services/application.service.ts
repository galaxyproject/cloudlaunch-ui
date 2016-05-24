import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

import { Application } from '../models/application';

@Injectable()
export class ApplicationService {
   constructor(private _http: Http) { }

   // TODO: This needs to be obtained from some global config
   private _application_url = 'http://localhost:8000/api/v1/applications/';


   public getApplications(): Observable<Application[]> {
      return this._http.get(this._application_url)
            .map(response => response.json().results);
   }

   public getApplication(slug: string): Observable<Application> {
      return this._http.get(this._application_url + slug + '/')
            .map(response => response.json());
   }
}
