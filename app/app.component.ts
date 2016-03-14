import { provide } from 'angular2/core';
import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { RequestOptions, BaseRequestOptions } from 'angular2/http';

// Services
import { ApplicationService } from './services/application.service';
import { LoginService } from './services/login.service';
import { LoggedInRouterOutlet } from './directives/loggedinrouter.directive';

// Pages
import { LoginPageComponent } from './pages/login.page.component';
import { MarketplacePageComponent } from './pages/marketplace.page.component';
import { ApplianceDetailPageComponent } from './pages/appliance-detail.page.component';
import { HomeComponent } from './pages/home.component';

// Components
import { DashboardComponent } from './components/dashboard.component';



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
      LoginService, ApplicationService
   ]
})

@RouteConfig([
   { path: '/home', name: 'Home', component: HomeComponent },
   { path: '/login', name: 'Login', component: LoginPageComponent },
   { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
   { path: '/marketplace', name: 'Marketplace', component: MarketplacePageComponent, useAsDefault: true },
   { path: '/marketplace/appliance/:slug/', name: 'ApplianceDetail',
     component: ApplianceDetailPageComponent },
])

export class AppComponent implements AfterViewChecked {
   
   ngAfterViewChecked() {
      // Unfortunately, there's no single place to apply material effects
      // and it's therefore done during this lifecycle method.
      $.material.init();
      $("select").dropdown();
   }
}
