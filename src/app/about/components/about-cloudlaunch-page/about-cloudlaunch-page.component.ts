import { Component, trigger, transition, animate,
    style, state } from '@angular/core';

@Component({
   selector: 'about-cloudlaunch-page',
   templateUrl: './about-cloudlaunch-page.component.html',
   styleUrls: ['./about-cloudlaunch-page.component.css'],
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
export class AboutCloudLaunchPageComponent {
}
