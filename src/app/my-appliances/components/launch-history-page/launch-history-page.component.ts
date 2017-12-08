import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Observable } from 'rxjs/Observable';

import { Deployment } from '../../../shared/models/deployment';
import { DeploymentService } from '../../../shared/services/deployment.service';

@Component({
    selector: 'clui-launch-history-page',
    templateUrl: './launch-history-page.component.html',
    styleUrls: ['./launch-history-page.component.css'],
    host: { '[@routeAnimation]': 'true' },
    animations: [
        trigger('routeAnimation', [
            state('*', style({ opacity: 1 })),
            transition('void => *', [
                style({ opacity: 0 }),
                animate('0.5s')
            ])
        ])
    ]
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
