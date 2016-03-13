import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
   selector: 'home',
   templateUrl: 'app/pages/home.component.html',
   directives: [StandardLayoutComponent]
})
export class HomeComponent implements OnInit {

   constructor(
      private _router: Router) { }

   ngOnInit() {
   }

   onSubmit() {
      //this.errorMessage = null;
   }
}
