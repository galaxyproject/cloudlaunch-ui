import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Appliance } from '../models/appliance';
import { ApplianceService } from '../services/appliance.service';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
   selector: 'marketplace',
   templateUrl: 'app/components/marketplace.component.html',
   styleUrls: ['app/components/marketplace.component.css'],
   directives: [StandardLayoutComponent]
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
