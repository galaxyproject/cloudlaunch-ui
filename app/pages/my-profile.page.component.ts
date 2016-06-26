import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { UserProfileComponent } from '../components/userprofile.component';
import { ProtectedDirective } from '../directives/loggedinrouter.directive';

@Component({
   selector: 'my-profile-page',
   templateUrl: 'app/pages/my-profile.page.component.html',
   styleUrls: ['app/pages/my-profile.page.component.css'],
   directives: [StandardLayoutComponent, UserProfileComponent, ProtectedDirective],
   host: {'class' : 'ng-animate pageLoadAnimation'}
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
