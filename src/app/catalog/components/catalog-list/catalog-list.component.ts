import { Component, OnDestroy, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { Observable, Subscription } from 'rxjs';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';




import { Application } from '../../../shared/models/application';
import { ApplicationService } from '../../../shared/services/application.service';

@Component({
    selector: 'clui-catalog-list',
    templateUrl: './catalog-list.component.html',
    styleUrls: ['./catalog-list.component.css']
})

export class CatalogListComponent implements OnDestroy {
    subscription: Subscription;
    apps: Application[] = [];
    currentApp: Application;
    searchTermCtrl = new FormControl();
    totalApps = 0;
    currentPage = 0;
    searchInProgress = false;
    PAGE_SIZE = 6;

    constructor(private _appService: ApplicationService) {
        this.subscription = this.searchTermCtrl.valueChanges.pipe(
                                startWith(''),
                                debounceTime(300),
                                switchMap(term => { this.searchInProgress = true;
                                    return this._appService.queryApplications(term, this.currentPage, this.PAGE_SIZE); }))
                            .subscribe(
                                    result => { this.searchInProgress = false;
                                                this.currentPage = 0;
                                                this.totalApps = result.count;
                                                this.apps = result.results; },
                                    error => { this.searchInProgress = false; console.log(error); });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.currentApp = null;
    }

    onPageChange(event: PageEvent) {
        this.searchInProgress = true;
        this.currentPage = event.pageIndex;
        this._appService.queryApplications(this.searchTermCtrl.value, event.pageIndex + 1, this.PAGE_SIZE)
            .subscribe(
                result => { this.searchInProgress = false; this.totalApps = result.count; this.apps = result.results; },
                error => { this.searchInProgress = false; console.log(error); }
                );
    }

}
