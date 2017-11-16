import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PublicService } from '../../../shared/models/public_service';
import { PublicAppliancesService } from '../../../shared/services/public_appliances.service';

@Component({
    selector: 'app-public-appliances-list',
    templateUrl: './public-appliances-list.component.html',
    styleUrls: ['./public-appliances-list.component.css'],
    providers: [PublicAppliancesService]
})

export class PublicAppliancesListComponent {
    publicServicesObservable: Observable<PublicService[]>;

    constructor(
        private _publicAppliancesService: PublicAppliancesService) {
        this.publicServicesObservable = this._publicAppliancesService.getPublicServices().shareReplay(1);
    }
}
