import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { Cloud } from '../models/cloud';
import { InstanceType } from '../models/cloud';
import { Placement } from '../models/cloud';

@Injectable()
export class CloudService {
   constructor(private _http: Http) { }

   // TODO: This needs to be obtained from some global config
   private _application_url = 'http://127.0.0.1:8000/api/v1/infrastructure/clouds/';

   public getClouds() {
      return this._http.get(this._application_url)
         .map(response => <Cloud[]>response.json().results)
         .catch(this.handleError);
   }

   public getCloud(slug: string): Observable<Cloud> {
      return this._http.get(this._application_url + slug + '/')
         .map(response => <Cloud>response.json())
         .catch(this.handleError);
   }

   public getInstanceTypes(slug: string): Observable<InstanceType[]> {
      return this._http.get(this._application_url + slug + '/compute/instance_types/')
         .map(response => <InstanceType[]>response.json().results)
         .catch(this.handleError);
   }

   public getPlacements(slug: string): Observable<Placement[]> {
      console.log("Getting placements for " + slug);
      return this._http.get(this._application_url + slug + '/compute/regions/')
         .map(response => <Placement[]>response.json().results)
         .catch(this.handleError);
   }

   private handleError(error: Response) {
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
   }
}
