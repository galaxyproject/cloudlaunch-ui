import { Component } from '@angular/core';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { MarketplaceComponent } from '../components/marketplace.component';
import { ProtectedDirective } from '../directives/loggedinrouter.directive';

@Component({
   selector: 'marketplace-page',
   templateUrl: 'app/pages/marketplace.page.component.html',
   styleUrls: ['app/pages/marketplace.page.component.css'],
   directives: [StandardLayoutComponent, MarketplaceComponent, ProtectedDirective],
   host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class MarketplacePageComponent {
}
