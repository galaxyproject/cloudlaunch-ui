import { Component } from '@angular/core';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { LoginComponent } from '../components/login.component';

@Component({
   selector: 'login-page',
   templateUrl: 'app/pages/login.page.component.html',
   directives: [StandardLayoutComponent, LoginComponent]
})
export class LoginPageComponent {
}
