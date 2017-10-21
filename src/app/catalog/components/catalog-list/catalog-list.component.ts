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
    fetchInProgress: boolean = false;

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
        this.searchTerm.valueChanges
            .startWith('')
            .debounceTime(300)
            .switchMap(term => this._appService.getApplications(term))
            .subscribe(
                    apps => { this.fetchInProgress = false; this.apps = apps; },
                    error => { this.fetchInProgress = false; console.log(error) });
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.currentApp = null;
    }

}
