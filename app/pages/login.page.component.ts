import { Component } from '@angular/core';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { LoginComponent } from '../components/login.component';

@Component({
   selector: 'login-page',
   templateUrl: 'app/pages/login.page.component.html',
   styleUrls: ['app/pages/login.page.component.css'],
   directives: [StandardLayoutComponent, LoginComponent],
   host: {'class' : 'ng-animate pageLoadAnimation'}
})
export class LoginPageComponent {
}
