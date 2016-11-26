import { Component, OnInit } from '@angular/core';

import { Application } from '../../../shared/models/application';
import { ApplicationService } from '../../../shared/services/application.service';

@Component({
   selector: 'app-marketplace-list',
   templateUrl: './marketplace-list.component.html',
   styleUrls: ['./marketplace-list.component.css'],
})

export class MarketplaceListComponent implements OnInit {
   apps: Application[] = [];

   constructor(
      private _appService: ApplicationService) {}

   ngOnInit() {
      this._appService.getApplications()
         .subscribe(apps => this.apps = apps);
   }
}
