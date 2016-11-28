import { Component, trigger, transition, animate,
    style, state } from '@angular/core';

@Component({
   selector: 'app-public-appliances-page',
   templateUrl: './public-appliances-page.component.html',
   styleUrls: ['./public-appliances-page.component.css'],
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
export class PublicAppliancesPageComponent {
}
