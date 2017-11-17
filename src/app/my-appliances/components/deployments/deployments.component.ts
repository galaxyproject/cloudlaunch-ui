import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/combineLatest';
import { map, mergeMap, startWith } from 'rxjs/operators';

import { Deployment } from '../../../shared/models/deployment';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { UserProfile } from '../../../shared/models/profile';
import { ProfileService } from '../../../shared/services/profile.service';
import * as moment from 'moment';


@Component({
    selector: 'deployments',
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
        this.deployments = Observable
                           .interval(10000)
                           .startWith(0)
                           .mergeMap(() => this.deploymentService.getDeployments({archived: false}));
        this.currentTimer = Observable
                            .interval(5000)
                            .startWith(0)
                            .map(() => {
                                return moment();
                            });
        this.profile = this.profileService.getProfile().shareReplay(1); 
    }

    trackByDeploymentId(index: number, deployment: Deployment): string {
        return deployment.id;
    }
}
