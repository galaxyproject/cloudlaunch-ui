import { Component } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { CatalogListComponent } from '../catalog-list/catalog-list.component';

@Component({
    selector: 'clui-catalog-page',
    templateUrl: './catalog-page.component.html',
    styleUrls: ['./catalog-page.component.css'],
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
export class CatalogPageComponent {
}
