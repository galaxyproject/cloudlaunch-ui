import { Component } from '@angular/core';

@Component({
    selector: 'clui-public-appliances-page',
    templateUrl: './public-appliances-page.component.html',
    styleUrls: ['./public-appliances-page.component.css']
})
export class PublicAppliancesPageComponent {
    moreInfo = false;

    toggleInfo() {
        this.moreInfo = !this.moreInfo;
    }
}
