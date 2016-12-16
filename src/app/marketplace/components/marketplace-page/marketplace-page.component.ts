import { Component, trigger, transition, animate,
    style, state } from '@angular/core';
import { MarketplaceListComponent } from '../marketplace-list/marketplace-list.component';

@Component({
    selector: 'app-marketplace-page',
    templateUrl: './marketplace-page.component.html',
    styleUrls: ['./marketplace-page.component.css'],
    host: { '[@routeAnimation]': 'true' },
    animations: [
        trigger('routeAnimation', [
            state('*', style({ opacity: 1 })),
            transition('void => *', [
                style({ opacity: 0 }),
                animate('0.5s')
            ])
        ])
    ]
})
export class MarketplacePageComponent {
}
