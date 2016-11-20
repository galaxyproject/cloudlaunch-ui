import { Component, OnInit } from '@angular/core';


@Component({
   selector: 'my-profile-page',
   templateUrl: './my-profile-page.component.html',
   styleUrls: ['./my-profile-page.component.css'],
   host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class MyProfilePageComponent implements OnInit {

   constructor() { }

   ngOnInit() {
   }

   onSubmit() {
      //this.errorMessage = null;
   }
}
