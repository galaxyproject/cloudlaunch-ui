import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Deployment } from '../../../../shared/models/deployment';
import { Credentials } from '../../../../shared/models/profile';
import { DeploymentService } from '../../../../shared/services/deployment.service';
import { ProfileService } from '../../../../shared/services/profile.service';
import * as moment from 'moment';


@Component({
    selector: '.deployment',
    templateUrl: './deployment.component.html',
})

export class DeploymentComponent implements OnInit {

    _deployment: Deployment;
    _currentTimer: Observable<any>;
    credentials: Credentials;

    @ViewChild('kpLink') a;

    constructor(
        private _deploymentService: DeploymentService,
        private _profileService: ProfileService) {
    }

    ngOnInit() {
        this.initializeCloudCredentials(this.deployment);
        this.currentTimer = this.initializeClock();
    }

    @Input()
    set deployment(deployment: Deployment) {
        this._deployment = deployment;
    }
    get deployment(): Deployment {
        return this._deployment;
    }

    @Input()
    set currentTimer(currentTimer: Observable<any>) {
        this._currentTimer = currentTimer;
    }
    get currentTimer(): Observable<any> {
        return this._currentTimer;
    }

    initializeCloudCredentials(deployment: Deployment): void {
        this._profileService.getCredentialsForCloud(deployment.target_cloud)
            .flatMap(credentialsArray => Observable.from(credentialsArray))
            .filter(credential => credential.default)
            .subscribe(credentials => this.credentials = credentials);
    }

    calculateUptime(dep: Deployment, currentTime) {
        const launchTime = moment(dep.added);
        return moment.duration(currentTime.diff(launchTime)).humanize();
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

    runHealthCheckTask(deployment: Deployment) {
        this._deploymentService.createTask(deployment.id, "HEALTH_CHECK").subscribe();
    }

    isLatestTaskRunning(deployment: Deployment) {
        return deployment.latest_task.status == 'PENDING' || deployment.latest_task.status == 'PROGRESSING';
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
}
