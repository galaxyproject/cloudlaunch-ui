import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { PublicService } from '../models/public_service';
import { PublicAppliancesService } from '../services/public_appliances.service';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { PublicAppliancesMaps } from './public-appliances-maps.component';

@Component({
   selector: 'public-appliances',
   templateUrl: 'app/components/public-appliances.component.html',
   styleUrls: ['app/components/public-appliances.component.css'],
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES, PublicAppliancesMaps],
   providers: [PublicAppliancesService]
})

export class PublicAppliancesComponent implements OnInit {
   public_services: PublicService[] = [];

   constructor(
      private _router: Router,
      private _publicAppliancesService: PublicAppliancesService) {}

   ngOnInit() {
      this._publicAppliancesService.getPublicServices()
         .subscribe(services => this.public_services = services);
   }
}
