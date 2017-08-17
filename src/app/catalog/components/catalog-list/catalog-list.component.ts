import { Component, OnInit, trigger, transition, animate,
    style, state, HostListener } from '@angular/core';

import { Application } from '../../../shared/models/application';
import { ApplicationService } from '../../../shared/services/application.service';

@Component({
    selector: 'app-catalog-list',
    templateUrl: './catalog-list.component.html',
    styleUrls: ['./catalog-list.component.css'],
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

export class CatalogListComponent implements OnInit {
    apps: Application[] = [];
    currentApp: Application;

    constructor(
        private _appService: ApplicationService) { }

    ngOnInit() {
        this._appService.getApplications()
            .subscribe(apps => this.apps = apps);
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.currentApp = null;
      }
}
