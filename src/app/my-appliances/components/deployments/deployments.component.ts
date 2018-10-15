import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { map, mergeMap, startWith, shareReplay } from 'rxjs/operators';

import { Deployment } from '../../../shared/models/deployment';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { UserProfile } from '../../../shared/models/profile';
import { ProfileService } from '../../../shared/services/profile.service';
import * as moment from 'moment';


@Component({
    selector: 'clui-deployments',
    templateUrl: './deployments.component.html',
    styles: [`
               .archiving {
                  background-color: red;
               }
             `]
})

export class DeploymentsComponent implements OnInit {
    deployments: Observable<Deployment[]>;
    profile: Observable<UserProfile>;
    currentTimer: Observable<moment.Moment>;

    constructor(
        private deploymentService: DeploymentService,
        private profileService: ProfileService) {
    }

    ngOnInit() {
        this.deployments = interval(10000).pipe(
                               startWith(0),
                               mergeMap(() => this.deploymentService.getDeployments({archived: false})));
        this.currentTimer = interval(5000).pipe(
                               startWith(0),
                               map(() => moment()));
        this.profile = this.profileService.getProfile().pipe(shareReplay(1));
    }

    trackByDeploymentId(index: number, deployment: Deployment): string {
        return deployment.id;
    }
}
