import { Component, OnInit, trigger, transition, animate,
    style, state } from '@angular/core';


@Component({
    selector: 'my-profile-page',
    templateUrl: './my-profile-page.component.html',
    styleUrls: ['./my-profile-page.component.css'],
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
export class MyProfilePageComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    onSubmit() {
        //this.errorMessage = null;
    }
}
