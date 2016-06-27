import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Deployment } from '../models/deployment';
import { DeploymentService } from '../services/deployment.service';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
   selector: 'deployments',
   templateUrl: 'app/components/deployments.component.html',
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES, NgSwitch, NgSwitchDefault]

})

export class DeploymentsComponent implements OnInit {
   deployments: Deployment[] = [];

   constructor(
      private _router: Router,
      private _deploymentService: DeploymentService) {
   }

   ngOnInit() {
      this.fetchData().subscribe(deployments => this.deployments = deployments);
      this.initializePolling().subscribe(deployments => this.deployments = deployments);
   }
   
   timeDiff(dateEnd, dateBegin) {
      let diff = dateEnd.getTime() - dateBegin.getTime();
      
      let msec = diff;
      let hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      let ss = Math.floor(msec / 1000);
      msec -= ss * 1000;
      return hh + ":" + mm + ":" + ss;
   }
   
   calculateUptime(dep: Deployment) {
      return this.timeDiff(new Date(), new Date(Date.parse(dep.added)));
   }

   initializePolling() : Observable<Deployment[]> {
      let self = this;
      return Observable
        .interval(5000)
        .flatMap(() => {
            return self.fetchData();        
        });
   }
   
   fetchData() : Observable<Deployment[]> {
      return this._deploymentService.getDeployments();
   }
}
