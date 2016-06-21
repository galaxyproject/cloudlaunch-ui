import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

@Component({
   selector: 'dashboard',
   templateUrl: 'app/components/dashboard.component.html',
   styleUrls: ['app/components/dashboard.component.css']
})
export class DashboardComponent {
   public cloudName = "Mock cloud";

   constructor(
      private _router: Router) {
   }

}
