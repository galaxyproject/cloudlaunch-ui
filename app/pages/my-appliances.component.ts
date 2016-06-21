import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { DeploymentsComponent } from '../components/deployments.component';

@Component({
   selector: 'my-appliances',
   templateUrl: 'app/pages/my-appliances.component.html',
   directives: [StandardLayoutComponent, DeploymentsComponent]
})
export class MyAppliancesComponent implements OnInit {

   constructor(
      private _router: Router) { }

   ngOnInit() {
   }

   onSubmit() {
      //this.errorMessage = null;
   }
}
