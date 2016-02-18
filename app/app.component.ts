import {provide} from 'angular2/core';
import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { RequestOptions, BaseRequestOptions } from 'angular2/http';

import { ApplianceService } from './appliance.service';
import { ApplianceDetailComponent } from './appliance-detail.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { LoggedInRouterOutlet } from './loggedinrouter.directive';
import { MarketplaceComponent } from './marketplace.component';

class CustomRequestOptions extends BaseRequestOptions {
  constructor () {
    super();
    let auth_header = "Token " + sessionStorage.getItem('token') || localStorage.getItem('token');
    this.headers.append('Authorization', auth_header);
  }
}

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
      provide(RequestOptions, { useClass: CustomRequestOptions }),
      LoginService, ApplianceService
   ]
})

@RouteConfig([
   { path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true },
   { path: '/login', name: 'Login', component: LoginComponent },
   { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
   { path: '/marketplace', name: 'Marketplace', component: MarketplaceComponent },
   { path: '/marketplace/appliance/:id', name: 'ApplianceDetail',
     component: ApplianceDetailComponent },
])

export class AppComponent {
}
