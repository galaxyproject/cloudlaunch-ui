import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Deployment } from '../models/deployment';
import { DeploymentService } from '../services/deployment.service';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
   selector: 'deployments',
   templateUrl: 'app/components/deployments.component.html',
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES]
})

export class DeploymentsComponent implements OnInit {
   deployments: Deployment[] = [];

   constructor(
      private _router: Router,
      private _deploymentService: DeploymentService) {}

   ngOnInit() {
      this._deploymentService.getDeployments()
         .subscribe(deployments => this.deployments = deployments);
   }
}
