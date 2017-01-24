import { Injectable } from '@angular/core';
import { Http, ConnectionBackend } from '@angular/http';
import { CustomRequestOptions } from './custom-request-options';
import { Credentials } from '../../shared/models/profile';

/*
This class automatically injects authorization headers and other defaults
necessary when communicating with the CloudLaunch API.
*/
@Injectable()
export class CLAuthHttp extends Http {
    requestOpts: CustomRequestOptions;

    constructor(backend: ConnectionBackend) {
        let opts = new CustomRequestOptions();
        super(backend, opts);
        this.requestOpts = opts;
    }
    
    setCloudCredentials(credentials: Credentials) {
        this.requestOpts.setCloudCredentials(credentials);
    }
}