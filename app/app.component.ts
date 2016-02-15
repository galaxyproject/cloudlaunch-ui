import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { HomeComponent } from './home.component';
import {LoggedInRouterOutlet} from './loggedinrouter.directive';

@Component({
    selector: 'cloudlaunch-app',
    template: `
        <!-- The router-outlet displays the template for the current component based on the URL -->
        <router-outlet></router-outlet>
    `,
    directives: [LoggedInRouterOutlet],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        LoginService
    ]
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginComponent, useAsDefault: true },
  { path: '/home', name: 'Home', component: HomeComponent }
])
export class AppComponent {
}