import { Component } from '@angular/core';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { MarketplaceComponent } from '../components/marketplace.component';

@Component({
   selector: 'marketplace-page',
   templateUrl: 'app/pages/marketplace.page.component.html',
   directives: [StandardLayoutComponent, MarketplaceComponent]
})
export class MarketplacePageComponent {
}
