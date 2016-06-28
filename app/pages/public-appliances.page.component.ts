import { Component } from '@angular/core';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { PublicAppliancesComponent } from '../components/public-appliances.component';
import { ProtectedDirective } from '../directives/loggedinrouter.directive';

@Component({
   selector: 'public-appliances-page',
   templateUrl: 'app/pages/public-appliances.page.component.html',
   styleUrls: ['app/pages/public-appliances.page.component.css'],
   directives: [StandardLayoutComponent, PublicAppliancesComponent, ProtectedDirective],
   host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class PublicAppliancesPageComponent {
}
