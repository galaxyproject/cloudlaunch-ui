import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppSettings } from '../app.settings';
import { Cloud } from '../models/cloud';
import { InstanceType } from '../models/cloud';
import { Region } from '../models/cloud';
import { PlacementZone } from '../models/cloud';
import { KeyPair } from '../models/cloud';
import { Network } from '../models/cloud';
import { SubNet } from '../models/cloud';

@Injectable()
export class CloudService {
   constructor(private _http: Http) { }

   // TODO: This needs to be obtained from some global config
   private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/infrastructure/clouds/`;

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

   public getRegions(slug: string): Observable<Region[]> {
      return this._http.get(this._application_url + slug + '/compute/regions/')
         .map(response => <Region[]>response.json().results)
         .catch(this.handleError);
   }

   public getPlacementZones(slug: string, region: string): Observable<PlacementZone[]> {
      return this._http.get(this._application_url + slug + '/compute/regions/' + region + '/zones/')
         .map(response => <PlacementZone[]>response.json().results)
         .catch(this.handleError);
   }

   public getKeyPairs(slug: string): Observable<KeyPair[]> {
      return this._http.get(this._application_url + slug + '/security/keypairs/')
         .map(response => <KeyPair[]>response.json().results)
         .catch(this.handleError);
   }

   public getNetworks(slug: string): Observable<Network[]> {
      return this._http.get(this._application_url + slug + '/networks/')
         .map(response => <Network[]>response.json().results)
         .catch(this.handleError);
   }

   public getSubNets(slug: string, network_id: string): Observable<SubNet[]> {
      return this._http.get(this._application_url + slug + '/networks/' + network_id + '/subnets/')
         .map(response => <SubNet[]>response.json().results)
         .catch(this.handleError);
   }

   private handleError(error: Response) {
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
   }
}
