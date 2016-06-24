import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { DeploymentsComponent } from '../components/deployments.component';

@Component({
   selector: 'my-appliances-page',
   templateUrl: 'app/pages/my-appliances.page.component.html',
   styleUrls: ['app/pages/my-appliances.page.component.css'],
   directives: [StandardLayoutComponent, DeploymentsComponent],
   host: {'class' : 'ng-animate pageLoadAnimation'}
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
