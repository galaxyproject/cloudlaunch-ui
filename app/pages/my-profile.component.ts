import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { UserProfileComponent } from '../components/userprofile.component';

@Component({
   selector: 'my-profile',
   templateUrl: 'app/pages/my-profile.component.html',
   directives: [StandardLayoutComponent, UserProfileComponent]
})
export class MyProfileComponent implements OnInit {

   constructor(
      private _router: Router) { }

   ngOnInit() {
   }

   onSubmit() {
      //this.errorMessage = null;
   }
}
