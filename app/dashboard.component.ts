import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

@Component({
   selector: 'dashboard',
   templateUrl: 'app/dashboard.component.html',
   styleUrls: ['app/dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
   public cloudName = "Mock cloud";

   constructor(
      private _router: Router) {
   }

   ngOnInit() {
   }

}
