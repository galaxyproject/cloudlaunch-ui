import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'my-appliances-page',
   templateUrl: './my-appliances-page.component.html',
   styleUrls: ['./my-appliances-page.component.css'],
   host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class MyAppliancesPageComponent implements OnInit {

   constructor() { }

   ngOnInit() {
   }

   onSubmit() {
      //this.errorMessage = null;
   }
}
