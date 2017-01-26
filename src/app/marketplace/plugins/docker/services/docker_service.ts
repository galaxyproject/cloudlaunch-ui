import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CLAuthHttp } from '../../../../login/utils/cloudlaunch-http';
import { AppSettings } from '../../../../app.settings';
import { DockerRepositoryOverview } from '../models/docker';
import { DockerRepositoryDetail } from '../models/docker';
import { DockerRunConfiguration } from '../models/docker';
import { PortMapping } from '../models/docker';
import { EnvironmentVariable } from '../models/docker';
import { VolumeMapping } from '../models/docker';
import { DockerFileParser } from '../utils/docker_parser';

@Injectable()
export class DockerService {
    constructor(private _http: CLAuthHttp) { }

    docker_repo_url = 'https://hub.docker.com/v2/';
    cors_proxy_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/cors_proxy/`;
    
    searchDockerHub(term: string) : Observable<Array<DockerRepositoryOverview>> {
        let url = `${this.docker_repo_url}search/repositories/?query=${term}&page_size=20`;
        return this._http.get(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .map(response => <Array<DockerRepositoryOverview>>response.json().results)
            .catch(error => Observable.throw(error.json().error || 'Server error'));
    }
    
    getRepoDetail(repo: DockerRepositoryOverview) {
        let url = `${this.docker_repo_url}repositories/${repo.repo_name}`;
        return this._http.get(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .map(response => <Array<DockerRepositoryDetail>>response.json())
            .catch(error => Observable.throw(error.json().error || 'Server error'));
    }
    
    getDockerFile(repo: DockerRepositoryOverview) {
        let url = `${this.docker_repo_url}repositories/${repo.repo_name}/dockerfile`;
        return this._http.get(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .map(response => <Array<DockerRepositoryDetail>>response.json().contents)
            .catch(error => Observable.throw(error.json().error || 'Server error'));
    }

}
