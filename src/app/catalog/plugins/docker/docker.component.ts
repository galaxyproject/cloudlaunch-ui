import { Component, Host, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective } from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/distinctUntilChanged';

import { BasePluginComponent } from '../base-plugin.component';
import { AppSettings } from '../../../app.settings';
import { DockerRepositoryOverview } from './models/docker';
import { DockerRepositoryDetail } from './models/docker';
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
    fetchInProgress: boolean = false;
    selectedDockerFile: string;


    get form(): FormGroup {
        return this.dockerLaunchForm;
    }

    get configName(): string {
        return "config_docker";
    }

    constructor(fb: FormBuilder,
            parentContainer: FormGroupDirective,
            private _http: Http,
            private _dockerService: DockerService) {
        super(fb, parentContainer);
        this.dockerLaunchForm = fb.group({
            'repo_name': ['', Validators.required],
            'docker_file': ['']
        });
        this.searchTerm.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => this.onDockerSearch(term))
            .subscribe(
                    data => { this.fetchInProgress = false; this.searchResults = data; },
                    error => { this.fetchInProgress = false; console.log(error) });
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
        this.dockerLaunchForm.controls['repo_name'].setValue(repo.repo_name);
        
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
