import { Component } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
    selector: 'clui-public-appliances-page',
    templateUrl: './public-appliances-page.component.html',
    styleUrls: ['./public-appliances-page.component.css'],
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
export class PublicAppliancesPageComponent {
    moreInfo = false;

    toggleInfo() {
        this.moreInfo = !this.moreInfo;
    }
}
