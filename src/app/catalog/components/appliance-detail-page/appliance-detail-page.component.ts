import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';


// Services
import { ApplicationService } from '../../../shared/services/application.service';

// Models
import { Application } from '../../../shared/models/application';

@Component({
    selector: 'clui-appliance-detail-page',
    templateUrl: './appliance-detail-page.component.html',
    styleUrls: ['./appliance-detail-page.component.css'],
})
export class ApplianceDetailPageComponent implements OnInit, OnDestroy {
    application: Application;
    moreInfo = false;
    routeSubscription: Subscription;

    toggleInfo() {
        this.moreInfo = !this.moreInfo;
    }

    constructor(
        private _applicationService: ApplicationService,
        private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.routeSubscription = this._route.params.pipe(
                                    map(params => params['slug']),
                                    mergeMap(slug => this._applicationService.getApplication(slug)))
                                .subscribe(application => this.application = application);
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}
