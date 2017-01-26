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
import { DockerRepositoryOverview } from './models/docker';
import { DockerRepositoryDetail } from './models/docker';
import { DockerRunConfiguration } from './models/docker';
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
    searchResults: Array<DockerRepositoryOverview>;
    selectedRepoOverview: DockerRepositoryOverview;
    selectedRepoDetail: DockerRepositoryDetail;
    showAdvanced: boolean = false;
    fetchInProgress: boolean = false;
    _selectedDockerFile: string;


    get form(): FormGroup {
        return this.dockerLaunchForm;
    }

    get configName(): string {
        return "config_docker";
    }

    get selectedDockerFile(): string {
        return this._selectedDockerFile;
    }
    
    set selectedDockerFile(value) {
        this._selectedDockerFile = value;
        if (value) {
            let config = this._dockerService.parseDockerFile(value);
            config.repo_name = this.selectedRepoOverview.repo_name;
            this.setDockerConfigFormValues(config);
        }
    }

    constructor(private fb: FormBuilder,
            parentContainer: FormGroupDirective,
            private _http: Http,
            private _dockerService: DockerService) {
        super(fb, parentContainer);
        this.dockerLaunchForm = fb.group({
            'repo_name': ['', Validators.required],
            'entrypoint': [''],
            'command': [''],
            'work_dir': [''],
            'user': [''],
            'port_mappings': fb.array([this.initPortMapping()]),
            'env_vars': fb.array([this.initEnvVar()]),
            'volumes': fb.array([this.initVolumeMapping()])
        });
        this.searchTerm.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => this.onDockerSearch(term))
            .subscribe(
                    data => { this.fetchInProgress = false; this.searchResults = data; },
                    error => { this.fetchInProgress = false; console.log(error) });
    }

    initPortMapping() {
        return this.fb.group({
            'container_port': ['', Validators.required],
            'host_port': ['']
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
            'container_path': ['', Validators.required],
            'host_path': [''],
            'read_write': [''],
            'nocopy': ['']
        });
    }
    
    setDockerConfigFormValues(config: DockerRunConfiguration) {
        this.dockerLaunchForm.setControl('port_mappings',
                this.fb.array(config.port_mappings.map(x => this.initPortMapping())));
        this.dockerLaunchForm.setControl('env_vars',
                this.fb.array(config.env_vars.map(x => this.initEnvVar())));
        this.dockerLaunchForm.setControl('volumes',
                this.fb.array(config.volumes.map(x => this.initVolumeMapping())));
        this.dockerLaunchForm.patchValue(config);
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }
    
    onDockerSearch(term: string): Observable<Array<DockerRepositoryOverview>> {
        this.fetchInProgress = true;
        this.selectedRepoOverview = null;
        this.selectedRepoDetail = null;
        this.selectedDockerFile = null;
        this.dockerLaunchForm.reset();
        return this._dockerService.searchDockerHub(term);
    }
    
    onRepositorySelect(repo: DockerRepositoryOverview) {
        this.selectedRepoOverview = repo;
        this.selectedRepoDetail = null;
        this.fetchInProgress = true;
        this.selectedDockerFile = null;
        this.dockerLaunchForm.reset();
        
        Observable.forkJoin(
                this._dockerService.getRepoDetail(repo),
                this._dockerService.getDockerFile(repo)
        ).subscribe(
                data => {
                    this.fetchInProgress = false;
                    this.selectedRepoDetail = data[0];
                    this.selectedDockerFile = data[1];
                },
                error => { this.fetchInProgress = false; console.log(error); }
        );
    }
}
