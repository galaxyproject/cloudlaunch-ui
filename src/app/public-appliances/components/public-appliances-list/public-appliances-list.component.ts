import { Component, OnInit } from '@angular/core';

import { PublicService } from '../../../shared/models/public_service';
import { PublicAppliancesService } from '../../../shared/services/public_appliances.service';

@Component({
    selector: 'app-public-appliances-list',
    templateUrl: './public-appliances-list.component.html',
    styleUrls: ['./public-appliances-list.component.css'],
    providers: [PublicAppliancesService]
})

export class PublicAppliancesListComponent implements OnInit {
    public_services: PublicService[] = [];

    constructor(
        private _publicAppliancesService: PublicAppliancesService) { }

    ngOnInit() {
        this._publicAppliancesService.getPublicServices()
            .subscribe(services => this.public_services = services);
    }
}
