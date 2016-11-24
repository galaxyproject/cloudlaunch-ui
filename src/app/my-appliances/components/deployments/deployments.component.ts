import { Component, OnInit, OnDestroy } from '@angular/core';
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
   
   constructor(
      private _deploymentService: DeploymentService) {
   }

   ngOnInit() {
       this.deployments = this.initializePolling();
       this.currentTimer = this.initializeClock();
   }
   
   calculateUptime(dep: Deployment, currentTime) {
      let launchTime = moment(dep.added);
      return moment.duration(currentTime.diff(launchTime)).humanize();
   }

   initializePolling() : Observable<Deployment[]> {
      let self = this;
      return Observable
        .interval(5000)
        .startWith(0)
        .flatMap(() => {
            return this._deploymentService.getDeployments();
        });
   }
   
   initializeClock() : Observable<any> {
       let self = this;
       return Observable
         .interval(1000)
         .startWith(0)
         .map(() => {
             return moment();
         });
    }
}
