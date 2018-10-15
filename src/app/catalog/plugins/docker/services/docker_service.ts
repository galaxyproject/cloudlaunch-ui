import { throwError as observableThrowError,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppSettings } from '../../../../app.settings';
import { DockerRepositoryOverview } from '../models/docker';
import { DockerRepositoryDetail } from '../models/docker';
import { DockerRunConfiguration } from '../models/docker';
import { PortMapping } from '../models/docker';
import { EnvironmentVariable } from '../models/docker';
import { VolumeMapping } from '../models/docker';
import { DockerFileParser } from '../utils/docker_parser';
import { QueryResult } from '../../../../shared/models/query';

@Injectable()
export class DockerService {
    constructor(private http: HttpClient) { }

    docker_repo_url = 'https://hub.docker.com/v2/';
    cors_proxy_url = `${AppSettings.CLOUDLAUNCH_API_ENDPOINT}/cors_proxy/`;

    searchDockerHub(term: string): Observable<DockerRepositoryOverview[]> {
        const url = `${this.docker_repo_url}search/repositories/?query=${term}&page_size=20`;
        return this.http.get<QueryResult<DockerRepositoryOverview>>(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .pipe(
                    map(data => data.results),
                    catchError(error => observableThrowError(error.error || 'Server error')));
    }

    getRepoDetail(repo: DockerRepositoryOverview): Observable<DockerRepositoryDetail> {
        let url = '';
        if (repo.is_official) {
            url = `${this.docker_repo_url}repositories/library/${repo.repo_name}`;
        } else {
            url = `${this.docker_repo_url}repositories/${repo.repo_name}`;
        }
        return this.http.get<DockerRepositoryDetail>(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .pipe(catchError(error => observableThrowError(error.error || 'Server error')));
    }

    getDockerFile(repo: DockerRepositoryOverview) {
        let url = '';
        if (repo.is_official) {
            url = `${this.docker_repo_url}repositories/library/${repo.repo_name}/dockerfile`;
        } else {
            url = `${this.docker_repo_url}repositories/${repo.repo_name}/dockerfile`;
        }
        return this.http.get(`${this.cors_proxy_url}?url=${encodeURI(url)}`)
            .pipe(map(data => data['contents']),
                  catchError(error => observableThrowError(error.error || 'Server error')));
    }

    parseDockerFile(content: string): DockerRunConfiguration {
        const config = new DockerRunConfiguration();
        const parse_results = new DockerFileParser().parse(content);

        for (const command of parse_results) {
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
                    Object.keys(command.args).forEach(function(key) {
                        config.env_vars.push(new EnvironmentVariable(key, command.args[key]));
                    });
                    break;
                case 'VOLUME':
                    for (const vol of command.args) {
                        config.volumes.push(new VolumeMapping('', vol));
                    }
                    break;
            }
        }
        return config;
    }
}
