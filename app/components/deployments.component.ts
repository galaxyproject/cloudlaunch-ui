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
   
   calculateUptime(dep: Deployment) {
      return Date.now() - Date.parse(dep.added);
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
