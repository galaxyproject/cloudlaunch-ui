import { Component, OnInit, trigger, transition, animate,
    style, state } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/mergeMap';

// Services
import { ApplicationService } from '../../../shared/services/application.service';

// Models
import { Application } from '../../../shared/models/application';

@Component({
    selector: 'app-appliance-detail-page',
    templateUrl: './appliance-detail-page.component.html',
    styleUrls: ['./appliance-detail-page.component.css'],
    inputs: ['appliance'],
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
export class ApplianceDetailPageComponent implements OnInit {
    application: Application;
    moreInfo: boolean = false;

    toggleInfo() {
        this.moreInfo = !this.moreInfo;
    }

    constructor(
        private _applicationService: ApplicationService,
        private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._route.params
            .map(params => params['slug'])
            .mergeMap(slug => this._applicationService.getApplication(slug))
            .subscribe(application => this.application = application);
    }
}
