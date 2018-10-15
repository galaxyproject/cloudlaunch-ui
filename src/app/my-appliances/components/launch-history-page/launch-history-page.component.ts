import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Deployment } from '../../../shared/models/deployment';
import { DeploymentService } from '../../../shared/services/deployment.service';

@Component({
    selector: 'clui-launch-history-page',
    templateUrl: './launch-history-page.component.html',
    styleUrls: ['./launch-history-page.component.css'],
})
export class LaunchHistoryPageComponent implements OnInit {
    deployments: Observable<Deployment[]>;

    constructor(
        private _deploymentService: DeploymentService) {
    }

    ngOnInit() {
        this.deployments = this._deploymentService.getDeployments();
    }

    trackByDeploymentId(index: number, deployment: Deployment): string {
        return deployment.id;
    }
}
