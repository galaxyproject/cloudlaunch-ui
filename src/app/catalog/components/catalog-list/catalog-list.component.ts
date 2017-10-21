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
    searchTerm = new FormControl();
    totalApps: number = 0;
    currentPage: number = 0;
    fetchInProgress: boolean = false;
    PAGE_SIZE: number = 6;

    @Input()
    set filter(value: string) {
        this.searchTerm.setValue(value);
    }

    get filter() : string {
        return this.searchTerm.value;
    }

    constructor(
        private _appService: ApplicationService) { }

    ngOnInit() {
        this.currentPage = 0;
        this.totalApps = 0;
        this.fetchInProgress = true;
        this.searchTerm.valueChanges
            .startWith('')
            .debounceTime(300)
            .switchMap(term => this._appService.queryApplications(term, this.currentPage, this.PAGE_SIZE))
            .subscribe(
                    result => { this.fetchInProgress = false; this.totalApps = 0; this.currentPage = 0; this.totalApps = result.count; this.apps = result.results; },
                    error => { this.fetchInProgress = false; console.log(error) });
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.currentApp = null;
    }

    onPageChange(event) {
        this.fetchInProgress = true;
        this.currentPage = event.pageIndex;
        this._appService.queryApplications(this.filter, event.pageIndex+1, this.PAGE_SIZE)
        .subscribe(
                result => { this.fetchInProgress = false; this.totalApps = result.count; this.apps = result.results; },
                error => { this.fetchInProgress = false; console.log(error) }
                );
    }

}
