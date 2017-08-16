import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Deployment } from '../../../shared/models/deployment';
import { DeploymentService } from '../../../shared/services/deployment.service';
import * as moment from 'moment';


@Component({
    selector: 'deployments',
    templateUrl: './deployments.component.html',
})

export class DeploymentsComponent implements OnInit {
    deployments: Observable<Deployment[]>;
    currentTimer: Observable<any>;
    @ViewChild('kpLink') a;

    constructor(
        private _deploymentService: DeploymentService) {
    }

    ngOnInit() {
        this.deployments = this.initializePolling();
        this.currentTimer = this.initializeClock();
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

    getKP(dep: Deployment) {
        const data = [];
        // Only LAUNCH tasks can have the key pair data
        if (dep.latest_task.action == 'LAUNCH') {
            data.push(dep.latest_task.status.result.cloudLaunch.keyPair.material);
            const properties = {type: 'plain/text'};
            const file = new Blob(data, properties);
            const url = URL.createObjectURL(file);
            this.a.nativeElement.href = url;
        }

    }
}
