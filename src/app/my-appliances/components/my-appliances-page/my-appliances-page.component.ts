import { Component, OnInit, trigger, transition, animate,
    style, state } from '@angular/core';

@Component({
   selector: 'my-appliances-page',
   templateUrl: './my-appliances-page.component.html',
   styleUrls: ['./my-appliances-page.component.css'],
   host: { '[@routeAnimation]': 'true' },
   animations: [
     trigger('routeAnimation', [
       state('*', style({opacity: 1})),
       transition('void => *', [
         style({opacity: 0}),
         animate('0.5s')
       ])
     ])
   ]
})
export class MyAppliancesPageComponent implements OnInit {

   constructor() { }

   ngOnInit() {
   }

   onSubmit() {
      //this.errorMessage = null;
   }
}
