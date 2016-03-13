import { Component, OnInit } from 'angular2/core';
import { RouteParams } from 'angular2/router';

// Services
import { ApplianceService } from '../services/appliance.service';

// Components
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { ApplianceDetailComponent } from '../components/appliance-detail.component';

@Component({
   selector: 'appliance-detail-page',
   templateUrl: 'app/pages/appliance-detail.page.component.html',
   inputs: ['appliance'],
   directives: [StandardLayoutComponent, ApplianceDetailComponent]
})
export class ApplianceDetailPageComponent implements OnInit {
   appliance: Appliance;

   constructor(
      private _applianceService: ApplianceService,
      private _routeParams: RouteParams) {
   }

   ngOnInit() {
      let id = +this._routeParams.get('id');

      this._applianceService.getAppliance(id)
         .then(appliance => this.appliance = appliance);
   }

}