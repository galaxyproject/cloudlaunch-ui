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
        let url = '';
        if (repo.is_official)
            url = `${this.docker_repo_url}repositories/library/${repo.repo_name}`;
        else
            url = `${this.docker_repo_url}repositories/${repo.repo_name}`;
        return this._http.get(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .map(response => <Array<DockerRepositoryDetail>>response.json())
            .catch(error => Observable.throw(error.json().error || 'Server error'));
    }

    getDockerFile(repo: DockerRepositoryOverview) {
        let url = '';
        if (repo.is_official)
            url = `${this.docker_repo_url}repositories/library/${repo.repo_name}/dockerfile`;
        else
            url = `${this.docker_repo_url}repositories/${repo.repo_name}/dockerfile`;
        return this._http.get(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .map(response => <Array<DockerRepositoryDetail>>response.json().contents)
            .catch(error => Observable.throw(error.json().error || 'Server error'));
    }

    parseDockerFile(content: string) : DockerRunConfiguration {
        let config = new DockerRunConfiguration();
        let parse_results = new DockerFileParser().parse(content);

        for (let command of parse_results) {
            switch (command.name) {
                case 'ENTRYPOINT':
                    config.entrypoint = command.args;
                    break;
                case 'CMD':
                    config.command = command.args;
                    break;
                case 'WORKDIR':
                    config.work_dir = command.args;
                    break;
                case 'USER':
                    config.user = command.args;
                    break;
                case 'EXPOSE':
                    for (let port of command.args) {
                        port = port.replace(':', '');
                        config.port_mappings.push(new PortMapping(port, port));
                    }
                    break;
                case 'ENV':
                    for (let key in command.args) {
                        config.env_vars.push(new EnvironmentVariable(key, command.args[key]));
                    }
                    break;
                case 'VOLUME':
                    for (let vol of command.args) {
                        config.volumes.push(new VolumeMapping('', vol));
                    }
                    break;
            }
        }
        return config;
    }
}
