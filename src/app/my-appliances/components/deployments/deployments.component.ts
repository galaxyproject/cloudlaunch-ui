import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Deployment } from '../../../shared/models/deployment';
import { Credentials } from '../../../shared/models/profile';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { ProfileService } from '../../../shared/services/profile.service';
import * as moment from 'moment';


@Component({
    selector: 'deployments',
    templateUrl: './deployments.component.html',
})

export class DeploymentsComponent implements OnInit {
    deployments: Observable<Deployment[]>;
    currentTimer: Observable<any>;
    cloudCredentials: Observable<Credentials>;
    // TODO: should this map only hold the default credential per cloud?
    credentialsPerCloud: Map<string, Credentials> = new Map();
    @ViewChild('kpLink') a;

    constructor(
        private _deploymentService: DeploymentService,
        private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.deployments = this.initializePolling();
        this.currentTimer = this.initializeClock();
        this.cloudCredentials = this.initializeCloudCredentials(this.deployments);
        this.cloudCredentials.subscribe(credentials => {
            this.credentialsPerCloud.set(credentials.cloud.slug, credentials);
        });
    }

    calculateUptime(dep: Deployment, currentTime) {
        const launchTime = moment(dep.added);
        return moment.duration(currentTime.diff(launchTime)).humanize();
    }

    initializePolling(): Observable<Deployment[]> {
        const self = this;
        return Observable
            .interval(5000)
            .startWith(0)
            .flatMap(() => {
                return this._deploymentService.getDeployments();
            });
    }

    initializeClock(): Observable<any> {
        const self = this;
        return Observable
            .interval(1000)
            .startWith(0)
            .map(() => {
                return moment();
            });
    }

    initializeCloudCredentials(deployments: Observable<Deployment[]>): Observable<Credentials> {
        return deployments
            .flatMap(deploymentsArray => Observable.from(deploymentsArray))
            .map(deployment => deployment.target_cloud)
            .distinct()
            .flatMap((slug: string) => {
                return this._profileService.getCredentialsForCloud(slug);
            })
            .flatMap(credentialsArray => Observable.from(credentialsArray))
            .filter(credential => credential.default);
    }

    getKP(dep: Deployment) {
        const data = [];
        // Only LAUNCH tasks can have the key pair data
        if (dep.latest_task.action == 'LAUNCH') {
            data.push(dep.latest_task.result.cloudLaunch.keyPair.material);
            const properties = {type: 'plain/text'};
            const file = new Blob(data, properties);
            const url = URL.createObjectURL(file);
            this.a.nativeElement.href = url;
        }

    }

    runHealthCheckTask(deployment: Deployment) {
        this._deploymentService.createTask(deployment.id, "HEALTH_CHECK").subscribe();
    }
}
