import { Component, OnInit, trigger, transition, animate,
    style, state, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

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
    searchTermCtrl = new FormControl();
    totalApps: number = 0;
    currentPage: number = 0;
    searchInProgress: boolean = false;
    PAGE_SIZE: number = 6;

    constructor(
        private _appService: ApplicationService) { }

    ngOnInit() {
        this.currentPage = 0;
        this.totalApps = 0;
        this.searchTermCtrl.valueChanges
            .startWith('')
            .debounceTime(300)
            .switchMap(term => { this.searchInProgress = true; return this._appService.queryApplications(term, this.currentPage, this.PAGE_SIZE) })
            .subscribe(
                    result => { this.searchInProgress = false; this.totalApps = 0; this.currentPage = 0; this.totalApps = result.count; this.apps = result.results; },
                    error => { this.searchInProgress = false; console.log(error) });
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.currentApp = null;
    }

    onPageChange(event) {
        this.searchInProgress = true;
        this.currentPage = event.pageIndex;
        this._appService.queryApplications(this.searchTermCtrl.value, event.pageIndex+1, this.PAGE_SIZE)
        .subscribe(
                result => { this.searchInProgress = false; this.totalApps = result.count; this.apps = result.results; },
                error => { this.searchInProgress = false; console.log(error) }
                );
    }

}
