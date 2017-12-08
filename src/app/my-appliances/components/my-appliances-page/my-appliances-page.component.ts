import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'clui-my-appliances-page',
    templateUrl: './my-appliances-page.component.html',
    styleUrls: ['./my-appliances-page.component.css'],
})
export class MyAppliancesPageComponent {
    moreInfo = false;

    toggleInfo() {
        this.moreInfo = !this.moreInfo;
    }
}
