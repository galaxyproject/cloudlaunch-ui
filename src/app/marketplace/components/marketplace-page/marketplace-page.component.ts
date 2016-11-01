import { Component } from '@angular/core';
import { MarketplaceListComponent } from '../marketplace-list/marketplace-list.component';

@Component({
   selector: 'app-marketplace-page',
   templateUrl: './marketplace-page.component.html',
   styleUrls: ['./marketplace-page.component.css'],
   host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class MarketplacePageComponent {
}
