import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Appliance } from './appliance';
import { ApplianceService } from './appliance.service';

@Component({
   selector: 'marketplace',
   templateUrl: 'app/marketplace.component.html',
   styleUrls: ['app/marketplace.component.css'],
})

export class MarketplaceComponent implements OnInit {
   apps: Appliance[] = [];

   constructor(
      private _router: Router,
      private _appService: ApplianceService) {
   }

   ngOnInit() {
      this._appService.getAppliances()
         .then(apps => this.apps = apps);
   }

   gotoDetail(app: Appliance) {
      let link = ['ApplianceDetail', { id: app.id }];
      this._router.navigate(link);
   }

}
