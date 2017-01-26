import { Component, Host, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective } from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BasePluginComponent } from '../base-plugin.component';
import { AppSettings } from '../../../app.settings';
import { DockerRepositoryOverview, DockerRepositoryDetail } from './models/docker';
import { DockerService } from './services/docker_service';

@Component({
    selector: 'docker-config',
    templateUrl: './docker.component.html',
    styleUrls: ['./docker.component.css'],
    inputs: ['cloud', 'initialConfig'],
    providers: [DockerService]
})
export class DockerConfigComponent extends BasePluginComponent {
    dockerLaunchForm: FormGroup;
    searchTerm = new FormControl();
    searchResults: Observable<Array<DockerRepositoryOverview>>;
    selectedRepo: DockerRepositoryOverview;
    selectedDockerFile: string;
    showAdvanced: boolean = false;


    get form(): FormGroup {
        return this.dockerLaunchForm;
    }

    get configName(): string {
        return "config_docker";
    }

    constructor(private fb: FormBuilder,
            parentContainer: FormGroupDirective,
            private _http: Http,
            private _dockerService: DockerService) {
        super(fb, parentContainer);
        this.dockerLaunchForm = fb.group({
            'repo_name': ['', Validators.required],
            'entrypoint': [''],
            'work_dir': [''],
            'user': [''],
            'port_mappings': fb.array([this.initPortMapping()]),
            'env_vars': fb.array([this.initEnvVar()]),
            'volumes': fb.array([this.initVolumeMapping()])
        });
        this.searchResults = this.searchTerm.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => this.onDockerSearch(term));
    }

    initPortMapping() {
        return this.fb.group({
            'container_port': ['', Validators.required],
            'host_port': ['', Validators.required]
        });
    }

    initEnvVar() {
        return this.fb.group({
            'variable': ['', Validators.required],
            'value': ['', Validators.required]
        });
    }

    initVolumeMapping() {
        return this.fb.group({
            'host_path': ['', Validators.required],
            'container_path': ['', Validators.required],
            'read_write': [''],
            'nocopy': ['']
        });
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }
    
    onDockerSearch(term: string): Observable<Array<DockerRepositoryOverview>> {
        this.selectedRepo = null;
        return this._dockerService.searchDockerHub(term);
    }
    
    onRepositorySelect(repo: DockerRepositoryOverview) {
        this._dockerService.getRepoDetail(repo).subscribe(
                data => this.selectedRepo = data,
                error => console.log(error));
        this._dockerService.getDockerFile(repo).subscribe(
                data => this.selectedDockerFile = data,
                error => console.log(error));
    }
}
