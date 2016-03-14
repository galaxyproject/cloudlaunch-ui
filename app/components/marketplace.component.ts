import { Component, OnInit } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { Application } from '../models/application';
import { ApplicationService } from '../services/application.service';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
   selector: 'marketplace',
   templateUrl: 'app/components/marketplace.component.html',
   styleUrls: ['app/components/marketplace.component.css'],
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES]
})

export class MarketplaceComponent implements OnInit {
   apps: Application[] = [];

   constructor(
      private _router: Router,
      private _appService: ApplicationService) {}

   ngOnInit() {
      this._appService.getApplications()
         .subscribe(apps => this.apps = apps);
   }
}
