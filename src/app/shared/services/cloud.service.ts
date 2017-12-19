import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
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
        return this.http.get<QueryResult<Cloud>>(this._application_url)
            .map(qr => qr.results)
            .catch(this.handleError);
    }

    public getCloud(slug: string): Observable<Cloud> {
        return this.http.get<Cloud>(`${this._application_url}${slug}/`)
            .catch(this.handleError);
    }

    public getVmTypes(slug: string): Observable<VmType[]> {
        return this.http.get<QueryResult<VmType>>(`${this._application_url}${slug}/compute/vm_types/`)
            .map(qr => qr.results)
            .catch(this.handleError);
    }

    public getRegions(slug: string): Observable<Region[]> {
        return this.http.get<QueryResult<Region>>(`${this._application_url}${slug}/compute/regions/`)
            .map(qr => qr.results)
            .catch(this.handleError);
    }

    public getPlacementZones(slug: string, region: string): Observable<PlacementZone[]> {
        return this.http.get<QueryResult<PlacementZone>>(`${this._application_url}${slug}/compute/regions/${region}/zones/`)
            .map(response => response.results)
            .catch(this.handleError);
    }

    public getKeyPairs(slug: string): Observable<KeyPair[]> {
        return this.http.get<QueryResult<KeyPair>>(`${this._application_url}${slug}/security/keypairs/`)
            .map(qr => qr.results)
            .catch(this.handleError);
    }

    public getNetworks(slug: string): Observable<Network[]> {
        return this.http.get<QueryResult<Network>>(`${this._application_url}${slug}/networking/networks/`)
            .map(response => response.results)
            .catch(this.handleError);
    }

    public getSubNets(slug: string, network_id: string): Observable<SubNet[]> {
        return this.http.get<QueryResult<SubNet>>(`${this._application_url}${slug}/networking/networks/${network_id}/subnets/`)
            .map(qr => qr.results)
            .catch(this.handleError);
    }

    public getGateways(slug: string, network_id: string): Observable<Gateway[]> {
        return this.http.get<QueryResult<Gateway>>(`${this._application_url}${slug}/networking/networks/${network_id}/gateways/`)
            .map(response => response.results)
            .catch(this.handleError);
    }

    public getStaticIPs(slug: string, network_id: string, gateway_id: string): Observable<StaticIP[]> {
        console.log('network_id: ' + network_id + ', gateway_id: ' + gateway_id);
        return this.http.get<QueryResult<StaticIP>>(
                `${this._application_url}${slug}/networking/networks/${network_id}/gateways/${gateway_id}/floating_ips/`)
            .map(qr => qr.results)
            .catch(this.handleError);
    }

    public getSavedClusters(slug: string): Observable<CloudManCluster[]> {
        return this.http.get(`${this._application_url}${slug}/cloudman/`)
            .map(data => <CloudManCluster[]>data['saved_clusters'])
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
