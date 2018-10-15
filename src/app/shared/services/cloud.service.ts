import { throwError as observableThrowError,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AppSettings } from '../../app.settings';
import { Cloud } from '../models/cloud';
import { VmType } from '../models/cloud';
import { Region } from '../models/cloud';
import { PlacementZone } from '../models/cloud';
import { KeyPair } from '../models/cloud';
import { Network } from '../models/cloud';
import { SubNet } from '../models/cloud';
import { Gateway } from '../models/cloud';
import { StaticIP } from '../models/cloud';
import { CloudManCluster } from '../models/cloud';
import { QueryResult } from '../models/query';


@Injectable()
export class CloudService {
    constructor(private http: HttpClient) { }

    // TODO: This needs to be obtained from some global config
    private _application_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/infrastructure/clouds/`;

    public getClouds(): Observable<Cloud[]> {
        return this.http.get<QueryResult<Cloud>>(this._application_url).pipe(
            map(qr => qr.results),
            catchError(this.handleError));
    }

    public getCloud(slug: string): Observable<Cloud> {
        return this.http.get<Cloud>(`${this._application_url}${slug}/`).pipe(
            catchError(this.handleError));
    }

    public getVmTypes(slug: string): Observable<VmType[]> {
        return this.http.get<QueryResult<VmType>>(`${this._application_url}${slug}/compute/vm_types/`)
            .pipe(
                    map(qr => qr.results),
                    catchError(this.handleError));
    }

    public getRegions(slug: string): Observable<Region[]> {
        return this.http.get<QueryResult<Region>>(`${this._application_url}${slug}/compute/regions/`)
            .pipe(
                    map(qr => qr.results),
                    catchError(this.handleError));
    }

    public getPlacementZones(slug: string, region: string): Observable<PlacementZone[]> {
        return this.http.get<QueryResult<PlacementZone>>(`${this._application_url}${slug}/compute/regions/${region}/zones/`)
            .pipe(
                    map(response => response.results),
                    catchError(this.handleError));
    }

    public getKeyPairs(slug: string): Observable<KeyPair[]> {
        return this.http.get<QueryResult<KeyPair>>(`${this._application_url}${slug}/security/keypairs/`)
            .pipe(
                    map(qr => qr.results),
                    catchError(this.handleError));
    }

    public getNetworks(slug: string): Observable<Network[]> {
        return this.http.get<QueryResult<Network>>(`${this._application_url}${slug}/networking/networks/`)
            .pipe(
                    map(response => response.results),
                    catchError(this.handleError));
    }

    public getSubNets(slug: string, network_id: string): Observable<SubNet[]> {
        return this.http.get<QueryResult<SubNet>>(`${this._application_url}${slug}/networking/networks/${network_id}/subnets/`)
            .pipe(
                    map(qr => qr.results),
                    catchError(this.handleError));
    }

    public getGateways(slug: string, network_id: string): Observable<Gateway[]> {
        return this.http.get<QueryResult<Gateway>>(`${this._application_url}${slug}/networking/networks/${network_id}/gateways/`)
            .pipe(
                    map(response => response.results),
                    catchError(this.handleError));
    }

    public getStaticIPs(slug: string, network_id: string, gateway_id: string): Observable<StaticIP[]> {
        console.log('network_id: ' + network_id + ', gateway_id: ' + gateway_id);
        return this.http.get<QueryResult<StaticIP>>(
                `${this._application_url}${slug}/networking/networks/${network_id}/gateways/${gateway_id}/floating_ips/`)
            .pipe(
                    map(qr => qr.results),
                    catchError(this.handleError));
    }

    public getSavedClusters(slug: string): Observable<CloudManCluster[]> {
        return this.http.get(`${this._application_url}${slug}/cloudman/`)
            .pipe(
                    map(data => <CloudManCluster[]>data['saved_clusters']),
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
